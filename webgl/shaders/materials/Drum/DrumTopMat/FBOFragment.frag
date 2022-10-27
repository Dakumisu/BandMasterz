precision highp float;

uniform float time;
uniform float kickSide[2];
uniform vec4 res;
uniform vec2 fboSize;
uniform sampler2D uFBO, noiseVoronoi, noiseFbm, noisePerlin;

varying vec2 vUv;

#include <blur>
#include <getScreenPos>
#include <mixUV>
#include <generateNoiseUV>

float drawWave(vec2 uv, vec2 pos, float mult) {
	float wave = length(uv - pos);
	wave *= mult;
	wave = 1. - smoothstep(0., .5, wave);

	return wave;
}

void main() {
	vec2 uv = vUv;
	float ltime = time * .001 + 10.;

	vec4 noise = texture2D(noisePerlin, uv);
	vec2 noiseUv = generateNoiseUV(noisePerlin, uv, ltime);

	vec2 transfromUv = mixUV(uv, noiseUv, .12);
	// vec2(noiseUv.r, noiseUv.g) * uv;

	// vec2 blurOffset = vec2(1.) / fboSize;
	// noise = blur(noise, uFBO, uv, blurOffset);

	vec2 cellSize = 1. / fboSize;
	vec2 fragUv = gl_FragCoord.xy;
	vec2 cellUv = fragUv * cellSize;
	float viscosity = 0.998;

	// * heightmapValue.x == height from previous frame
	// * heightmapValue.y == height from penultimate frame
	// * heightmapValue.z, heightmapValue.w not used
	vec4 heightmapValue = texture2D(uFBO, cellUv);

	float propagation = 5.;
	vec4 north = texture2D(uFBO, cellUv + vec2(0.0, cellSize.y * propagation));
	vec4 south = texture2D(uFBO, cellUv + vec2(0.0, -cellSize.y * propagation));
	vec4 east = texture2D(uFBO, cellUv + vec2(cellSize.x * propagation, 0.0));
	vec4 west = texture2D(uFBO, cellUv + vec2(-cellSize.x * propagation, 0.0));

	float newRt = ((north.x + south.x + east.x + west.x) * .5 - heightmapValue.y) * viscosity;

	float mult = 6.;

	vec2 posKickA = vec2(.59, .63);
	float pointA = drawWave(uv, posKickA, mult);

	vec2 posKickB = vec2(.59, .31);
	float pointB = drawWave(uv, posKickB, mult);

	float points = 0.;
	points += pointA * kickSide[0];
	points += pointB * kickSide[1];

	float kick = points;

	newRt += kick;

	heightmapValue.y = heightmapValue.x;
	heightmapValue.x = newRt;

	vec3 final = heightmapValue.rgb;
	// final.xy *= heightmapValue.xy;

	gl_FragColor = vec4(vec3(kick), 1.0);
	gl_FragColor = vec4(heightmapValue.xy, 0., 1.);
	gl_FragColor = vec4(final, 1.0);
	// gl_FragColor = noise;
	// gl_FragColor = vec4(noiseUv, 0., 1.0);
	// gl_FragColor = vec4(transfromUv, 0., 1.0);
}
