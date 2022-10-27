precision highp float;

varying vec2 vUv;
uniform sampler2D uFBO, uVelocityFBO;
uniform float uSpeed, time;

void main() {
	vec2 uv = vUv;

	vec4 velocityData = texture2D(uVelocityFBO, uv);
	vec4 inputData = texture2D(uFBO, uv);

	inputData.r += sin(time * uSpeed);
	inputData.g += cos(time * uSpeed);
	inputData.b += sin(time * uSpeed);

	// inputData.xyz += velocityData.xyz * uSpeed * time;
	gl_FragColor = inputData;
}
