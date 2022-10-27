import { prng } from '@cafe-noisette/philbin/utils/maths';
import BaseComponent from '@cafe-noisette/philbin/webgl/components/BaseComponent';
import createFilter from '@cafe-noisette/philbin/webgl/utils/createFilter';
import pingPongRT from '@webgl/utils/pingPongRT';

import HeightFragment from './HeightFragment.frag?hotshader';

class FBO extends BaseComponent {
	constructor({ name = 'fbo', heightFragment = null } = {}) {
		super();

		this.name = name;
		this.heightFragment = heightFragment;
	}

	init() {
		const { size } = this.webgl.$viewport;

		this.pprt = pingPongRT({
			name: this.name,
			width: size,
			height: size,
		});

		this.heightFilter = createFilter({
			renderer: this.webgl.$renderer.instance,
			uniforms: {
				uFBO: this.pprt.uniform,
				...this.webgl.uniforms,
				seed: { value: prng.hash2d(prng.random(), prng.random()) },
			},
			defines: {
				...this.webgl.defines,
			},
		});
		this.heightFragment.use(this.heightFilter.material);
	}

	update() {
		this.pprt.bind();
		this.heightFilter.render();

		this.pprt.unbind();
		// if (this.webgl.matToRender)
		// 	this.webgl.matToRender.map(
		// 		(mat) => (mat.uniforms.uFBO.value = this.pprt.uniform.value),
		// 	);
		// this.composerFilter.render();

		this.pprt.swap();
	}
}

export { FBO };
export default FBO;
