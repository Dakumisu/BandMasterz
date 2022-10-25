precision highp float;

uniform vec3 uColor;

varying vec3 vNormal;

void main() {
	vec3 normal = normalize(vNormal);
	float lighting = dot(normal, normalize(vec3(-0.3, 0.8, 0.6)));

	vec3 color = vec3(uColor);
	color += lighting * 0.1;

	gl_FragColor = vec4(color, 1.0);
}
