import { Vector4 } from 'three';

export default function getCommonUniforms(webgl) {
	if (webgl.uniforms) return webgl.uniforms;

	const { list } = webgl.$stores.colors;

	const colors = Object.keys(list).reduce((p, v) => {
		p[v] = { value: list[v] };
		return p;
	}, {});

	const uniforms = {
		time: { value: 0 },
		textures: {},
		res: { value: new Vector4() },
		...colors,
		colors: { value: Object.values(list) },
	};

	Object.assign(webgl, { uniforms });
}
