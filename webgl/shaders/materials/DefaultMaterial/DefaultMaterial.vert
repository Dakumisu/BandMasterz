#define PHONG

#include <common>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <normal_pars_vertex>
#include <shadowmap_pars_vertex>
#include <worldpos_pars>

uniform float blockScale;
uniform float yMult;

attribute vec3 translation;
attribute float scale;
attribute float type;
attribute float alpha;

varying vec3 vViewPosition;
varying float vType;
varying float vAlpha;

void main() {
	#include <uv_vertex>

	#include <beginnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	#include <begin_vertex>

	float a = smoothstep(0.12, 1., alpha);

	transformed *= blockScale;

	transformed.xz *= a;
	transformed.y *= (1. + (1. - a) * -0.2) * smoothstep(0., 0.7, alpha);
	transformed.xyz += translation.xyz;
	transformed.y += (1. - a) * yMult * sign(translation.y);

	#include <project_vertex>

	vViewPosition = - mvPosition.xyz;
	vType = type;
	vAlpha = a;

	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
}
