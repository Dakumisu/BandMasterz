varying vec3 vNormal;

#include <morphtarget_pars_vertex>

void main() {
	vec3 transformed = vec3(position);

	#include <morphtarget_vertex>

	vNormal = normalize(normalMatrix * normal);

	gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
