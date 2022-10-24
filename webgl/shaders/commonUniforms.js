import { Vector4 } from 'three';

export default function getCommonUniforms(webgl) {
	if (webgl.uniforms) return webgl.uniforms;

	const uniforms = {
		time: { value: 0 },
		textures: {},
		res: { value: new Vector4() },
	};

	Object.assign(webgl, { uniforms });
}
