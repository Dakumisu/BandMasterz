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
	color = mix(color, uColorDark, lighting);

	// if(lighting > 0.98)
	// 	color = vec3(1.0, 1.0, 1.0);
	// else if(lighting > 0.5)
	// 	color = vec3(0.8, 0.8, 0.8);
	// else if(lighting > 0.35)
	// 	color = vec3(0.4, 0.4, 0.4);
	// else
	// 	color = vec3(0.0, 0.0, 0.0);

	gl_FragColor = vec4(color, 1.0);
	// gl_FragColor = vec4(uv, 0., 1.0);
	// gl_FragColor = vec4(pos, 1.0);
	// gl_FragColor = vec4(vec3(lighting), 1.0);
}

// varying vec3 normal, lightDir;
// varying vec2 texCoord;
// uniform sampler2D texture;

// void main() {
// 	float intensity;
// 	vec3 n;
// 	vec4 _color;

// 	n = normalize(normal);
// 	intensity = dot(lightDir, n);

// 	if(intensity > 0.98)
// 		_color = vec4(1.0, 1.0, 1.0, 1.0);
// 	else if(intensity > 0.5)
// 		_color = vec4(0.8, 0.8, 0.8, 1.0);
// 	else if(intensity > 0.35)
// 		_color = vec4(0.4, 0.4, 0.4, 1.0);
// 	else
// 		_color = vec4(0.0, 0.0, 0.0, 1.0);
// 	gl_FragColor = _color * texture2D(texture, texCoord);
// }
