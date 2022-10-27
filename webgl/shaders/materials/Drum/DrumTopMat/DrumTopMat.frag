precision highp float;

uniform vec4 res;
uniform vec3 uColor, uColorDark;
uniform vec3 FlickrPink, Byzantine, PurpleHeart, Purple, TrypanBlue, PurpleMountainsMajesty, BlueBell, Blue, Cyan, Turquoise;
uniform vec3 colors[10];
uniform float kickAlpha, time;
uniform float kickSide[2];
uniform sampler2D uFBO, noiseVoronoi, noiseFbm, noisePerlin, noiseCurl;

varying vec3 vNormal, vPos;
varying vec2 vUv;

#include <getScreenPos>
#include <generateNoiseUV>
#include <mixUV>
#include <normSin>
#include <normCos>

int getColorIndex(float influence) {
	int index = 0;
	float max = 0.0;

	// #enroll-for-loop
	for(int i = 0; i < 10; i++) {
		if(influence > max) {
			max = influence;
			index = i;
		}
	}
	// #end-enroll-for-loop

	return index;
}

const vec3 black = vec3(0.);
const vec3 white = vec3(1.);

void main() {
	vec2 uv = vUv;
	vec2 normUv = getScreenPos(uv, res.xy);
	vec3 pos = vPos;
	vec3 normal = normalize(vNormal);
	float lighting = dot(normal, normalize(vec3(0., .3, .9)));
	float ltime = time * .001;
	float sinTime = normSin(ltime);
	float cosTime = normCos(ltime);

	vec2 noiseUv = generateNoiseUV(noisePerlin, uv, ltime * .7);
	noiseUv += generateNoiseUV(noiseCurl, uv, ltime * .7) * .6;
	noiseUv += generateNoiseUV(noiseFbm, uv, ltime * .7) * .2;
	noiseUv.x += .1;
	// noiseUv.y += .05;
	vec2 transfromUv = mixUV(uv, noiseUv, .45);
	vec2 transfromUv2 = mixUV(uv, noiseUv, .85);

	vec3 fbo = texture2D(uFBO, transfromUv).rgb;
	float fboOutLines = smoothstep(.7, 1., fbo.x);
	fboOutLines += smoothstep(.0, .35, fbo.x);

	vec2 fboUv = fbo.xy;

	vec3 color = vec3(uColor);
	// color += lighting * 0.1;
	color = mix(color, uColorDark, lighting);

	// generate gradients from colors by using the voronoi noise texture
	vec3 gradientBorder = vec3(0.);
	gradientBorder += texture2D(noiseVoronoi, uv + vec2(0., 0.) * (sinTime * .1 + ltime * .2)).rgb * colors[0];
	gradientBorder += texture2D(noiseFbm, uv + vec2(.2, 0.) * (cosTime * .1 + ltime * .2)).rgb * colors[2];
	gradientBorder += texture2D(noiseCurl, uv + vec2(.4, 0.) * (sinTime * .1 + ltime * .2)).rgb * colors[4];
	gradientBorder += texture2D(noiseVoronoi, uv + vec2(.6, 0.) * (cosTime * .1 + ltime * .2)).rgb * colors[6];
	gradientBorder += texture2D(noisePerlin, uv + vec2(.8, 0.) * (sinTime * .1 + ltime * .2)).rgb * colors[8];

	gradientBorder *= kickAlpha;

	// draw a mask on the border with some noise effect
	float mask = 1. - distance(transfromUv2, vec2(.49)) * 1.2;
	mask -= distance(transfromUv2, vec2(.35)) * 1.1;
	mask = smoothstep(0., .5, mask);
	mask *= smoothstep(0., .5, 1. - distance(transfromUv2, vec2(.5)));
	mask = 1. - mask;

	vec3 gradient = color;
	gradient += (mix(gradient, colors[1], noiseUv.x) * .2) * fbo.x * gradientBorder;
	gradient += (mix(gradient, colors[1], noiseUv.y) * .2) * fbo.y * gradientBorder;
	gradient += (mix(gradient, colors[5], noiseUv.x) * .2) * fbo.x * gradientBorder;
	gradient += (mix(gradient, colors[9], noiseUv.y) * .2) * fbo.y * gradientBorder;
	gradient += (mix(gradient, colors[9], noiseUv.x) * .2) * fbo.y * fbo.x * gradientBorder;
	gradient += (mix(gradient, colors[5], noiseUv.y) * .2) * fbo.y * fbo.x * gradientBorder;
	gradient *= smoothstep(.3, .7, colors[int((fboOutLines * (10. * sinTime * .3)) + (lighting * 5.))]) * .5;
	gradient += white * .2;

	gradient = mix(black, gradient, fboOutLines);

	gradientBorder *= mask * .2;
	gradientBorder += gradient * .2;

	vec3 render = color;
	// render += gradientBorder;
	render += gradient;
	render += fboOutLines * .15;

	gl_FragColor = vec4(render, 1.0);
	// gl_FragColor = vec4(kickColor, 1.0);
	// gl_FragColor = vec4(mix(firstColor, secondColor, step(uv.x, .5)), 1.0);
	// gl_FragColor = vec4(c, 1.0);
	// gl_FragColor = vec4(mixColor, 1.0);
	// gl_FragColor = vec4(gradient, 1.0);
	// gl_FragColor = vec4(uv, 0., 1.0);
	// gl_FragColor = vec4(pos, 1.0);
	// gl_FragColor = vec4(fbo, 1.0);
	// gl_FragColor = vec4(vec3(fboOutLines), 1.0);
}
