#define PHONG

#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphatest_pars_fragment>
#include <specularmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <normalmap_pars_fragment>

#include <worldpos_pars>

uniform vec3 specular;
uniform float shininess;
uniform vec3 groundColor;
uniform vec3 belowColor;

varying float vType;
varying float vAlpha;

uniform vec3 colorBlockUnbreakable;
uniform vec3 colorBlock1;
uniform vec3 colorBlock2;
uniform vec3 colorBlock3;
uniform vec3 colorBlock4;
uniform vec3 colorBlockBonus;

void main() {

	// Per-block type code
	vec3 blockColor = vec3(0.);
	if(vType < 1.5) {
		blockColor = colorBlockUnbreakable;
	} else if(vType < 2.5) {
		blockColor = colorBlock1;
	} else if(vType < 3.5) {
		blockColor = colorBlock2;
	} else if(vType < 4.5) {
		blockColor = colorBlock3;
	} else if(vType < 5.5) {
		blockColor = colorBlock4;
	} else if(vType > 4.5) {
		blockColor = colorBlockBonus;
	}

	// Def
	vec4 diffuseColor = vec4(blockColor, 1.);
	vec3 emissive = vec3(0.);

	#include <normal_fragment_begin>

	// Rim
	float demultDist = smoothstep(0., 0.15, gl_FragCoord.w);
	float rimLightPower = 2.4;
	float rimLightStrength = 0.4;
	vec3 rimColor = vec3(groundColor) * 9.2;
	float rightLight = rimLightPower * abs(dot(vNormal, normalize(vViewPosition)));
	rightLight = 1. - smoothstep(.0, 1., rightLight);
	diffuseColor.rgb += vec3(rightLight * rimLightStrength) * rimColor * demultDist;

	// Lighting
	float specularStrength = 1.;
	ReflectedLight reflectedLight = ReflectedLight(vec3(.0), vec3(.0), vec3(.0), vec3(.0));
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>

	float belowMult = step(0., vWorldPos.y);

	vec3 color = reflectedLight.directDiffuse +
		reflectedLight.indirectDiffuse +
		reflectedLight.directSpecular * (0.2 + belowMult * 0.8) +
		reflectedLight.indirectSpecular +
		emissive;

	color = mix(colorBlock1 * 10., color, vAlpha);

	color = mix(color * 1.5, color, belowMult);
	color = mix(color, belowColor, smoothstep(0.1, -1.2, vWorldPos.y));

	gl_FragColor = vec4(color, 1.);
}
