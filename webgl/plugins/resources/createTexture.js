import createTexture from '@webgl/utils/createTexture';

export default function loadTexture(webgl, t) {
	return function ({ node }) {
		const tex = webgl.textures[ t[ 1 ] ] = createTexture({
			img: node,
			flipY: false,
			...t[ 2 ]
		});
		if (!webgl.uniforms.textures) webgl.uniforms.textures = {};
		webgl.uniforms.textures[ t[ 1 ] ] = { value: tex };
	};
}
