import { createLogger } from '@cafe-noisette/philbin/utils/debug';
import { prng } from '@cafe-noisette/philbin/utils/maths';
import BaseMixin from '@cafe-noisette/philbin/webgl/mixins/BaseMixin';
import createFilter from '@cafe-noisette/philbin/webgl/utils/createFilter';
import pingPongRT from '@webgl/utils/pingPongRT';

/// #if DEBUG
const log = createLogger('FBO', '#000', '#FED9B7').log;
/// #else
/// #code const log = () => {};
/// #endif

export default class FBOMixin extends BaseMixin {
	created() {
		const size = this.webgl.$viewport.size;

		const fbo = (this.base.fbo = {
			pprt: null,
			heightFilter: null,
			render: render.bind(this.base),
			resize: resize.bind(this.base),
		});

		fbo.pprt = pingPongRT({
			name: this.base.name,
			width: this.base.fboSize || size.value.x,
			height: this.base.fboSize || size.value.y,
		});

		fbo.heightFilter = createFilter({
			renderer: this.webgl.$renderer.instance,
			uniforms: {
				uFBO: fbo.pprt.uniform,
				...this.webgl.uniforms,
				...this.webgl.uniforms.textures,
				seed: { value: prng.hash2d(prng.random(), prng.random()) },
			},
			defines: {
				...this.webgl.defines,
			},
		});
		this.base.FBOFragment.use(fbo.heightFilter.material);
	}

	beforeDestroy() {}
}

function resize(x, y) {
	this.fbo.pprt.resize(x, y);
}

function render() {
	// log('render');
	if (!this.isInit) return;

	this.fbo.pprt.bind();
	this.fbo.heightFilter.render();

	this.fbo.pprt.unbind();
	if (this.updateTexture) this.updateTexture(this.fbo.pprt.uniform.value);

	this.fbo.pprt.swap();
}
