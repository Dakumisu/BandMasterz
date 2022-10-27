import webgl from '@cafe-noisette/philbin/webgl';

export default function pingPongRT({ name = '', ...opts } = {}) {
	let rtA = webgl.$fbo.createBuffer({ ...opts, name: name + '_A' });
	let rtB = webgl.$fbo.createBuffer({ ...opts, name: name + '_B' });

	const api = {
		resize,
		bind,
		unbind,
		swap,
		readable: rtA,
		writable: rtB,
		uniform: { type: 't', value: rtA },
	};

	return api;

	function resize(x, y) {
		rtA.setSize(x, y);
		rtB.setSize(x, y);
	}

	function bind() {
		webgl.$renderer.instance.setRenderTarget(api.writable);
	}

	function unbind() {
		webgl.$renderer.instance.setRenderTarget(null);
	}

	function swap() {
		[api.readable, api.writable] = [api.writable, api.readable];
		api.uniform.value = api.readable.texture;
	}
}
