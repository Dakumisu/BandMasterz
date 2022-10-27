precision highp float;

uniform vec3 uColor, uColorDark;

varying vec3 vNormal, vPos;
varying vec2 vUv;

void main() {
	vec2 uv = vUv;
	vec3 pos = vPos;
	vec3 normal = normalize(vNormal);
	float lighting = dot(normal, normalize(vec3(0., 0.3, 0.9)));

	vec3 color = vec3(uColor);
	color += lighting * 0.2;
	color = mix(color, uColorDark, 1. - lighting);

	gl_FragColor = vec4(color, 1.0);
	// gl_FragColor = vec4(uv, 0., 1.0);
	// gl_FragColor = vec4(pos, 1.0);
	// gl_FragColor = vec4(vec3(lighting), 1.0);
}
