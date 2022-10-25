varying vec3 vNormal;
varying vec3 vPos;
varying vec2 vUv;

#include <morphtarget_pars_vertex>

void main() {
	vec3 transformed = vec3(position);

	#include <morphtarget_vertex>

	vNormal = normalize(normalMatrix * normal);
	vUv = uv;
	vPos = transformed;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
