import _createBuffer from '@cafe-noisette/philbin/webgl/utils/createBuffer';
import createFilter from '@cafe-noisette/philbin/webgl/utils/createFilter';
import { Vector2, Vector4 } from 'three';
import { storageSync, w } from '@cafe-noisette/philbin/utils/state';

/// #if DEBUG
const fs = [
	'precision highp float;',
	'uniform sampler2D frame;',
	'varying vec2 vUv;',
	'void main() {',
	'vec2 uv = vUv;',
	'vec3 color = texture2D(frame, vUv ).rgb;',
	'gl_FragColor = vec4(color, 1.);',
	'}',
].join('');
/// #endif

const noop = () => {};

function createFboPlugin(webgl, opts = {}) {
	const { logger, name } = opts;

	const api = (webgl[name] = {
		createBuffer,
		registerBuffer: noop,
		unregisterBuffer: noop,
	});

	let initialized;

	/// #if DEBUG
	Object.assign(api, { registerBuffer, unregisterBuffer });
	let gui, guiList, previewFilter;
	const previewCoords = { previewPosition: new Vector2(), previewScale: 0.3 };
	const currentBuffer = { name: '' };
	const buffers = new Map([[false, 'None']]);
	const buffersByName = new Map([['None', false]]);
	const tvec4a = new Vector4();
	/// #endif

	function createBuffer(opts) {
		init();
		const buffer = _createBuffer(opts);
		/// #if DEBUG
		if (opts.name) registerBuffer(opts.name, buffer);
		/// #endif
		return buffer;
	}

	function init() {
		if (initialized) return;
		initialized = true;

		/// #if DEBUG
		previewFilter = createFilter({
			renderer: webgl.threeRenderer,
			fragmentShader: fs,
			uniforms: { frame: { type: 't' } },
			transparent: false,
		});

		gui = webgl.$gui.addFolder({
			title: 'Framebuffers',
			index: 4,
		});

		const pos = previewCoords.previewPosition;
		const scale = previewCoords.previewScale;
		const transform = storageSync(w([pos.x, pos.y, scale]), 'fbo_transform', { session: true });

		previewCoords.previewPosition.set(transform.value[0], transform.value[1]);
		previewCoords.previewScale = transform.value[2];

		gui.addInput(previewCoords, 'previewPosition', {
			x: { step: 10 },
			y: { step: 10 },
		}).on('change', (e) => {
			if (Math.abs(e.value.x) > 100000) return;
			if (Math.abs(e.value.y) > 100000) return;
			transform.value[0] = e.value.x;
			transform.value[1] = e.value.y;
			transform.set(transform.value, true);
		});

		gui.addInput(previewCoords, 'previewScale', { min: 0.05, max: 2 }).on('change', (e) => {
			if (Math.abs(e.value) > 100000) return;
			transform.value[2] = e.value;
			transform.set(transform.value, true);
		});

		refreshGui();
		webgl.hooks.afterFrame.watch(update);
		/// #endif
	}

	/// #if DEBUG
	function update() {
		const buffer = buffersByName.get(currentBuffer.name);
		if (!buffer) return;
		const size = webgl.$viewport.size.value;
		const tex = buffer.texture || buffer;
		const ratio = tex.image.width / tex.image.height;
		const width = size.x * previewCoords.previewScale;
		const height = width / ratio;
		const x = previewCoords.previewPosition.x;
		const y = size.y - height - previewCoords.previewPosition.y;

		const origAutoClear = webgl.threeRenderer.autoclear;
		const origViewport = webgl.threeRenderer.getViewport(tvec4a);
		const origRenderTarget = webgl.threeRenderer.getRenderTarget();
		webgl.threeRenderer.autoclear = false;
		webgl.threeRenderer.setRenderTarget(null);
		webgl.threeRenderer.setViewport(x, y, width, height);
		previewFilter.uniforms.frame.value = tex;
		previewFilter.render();
		webgl.threeRenderer.setViewport(origViewport);
		webgl.threeRenderer.setRenderTarget(origRenderTarget);
		webgl.threeRenderer.autoclear = origAutoClear;
	}

	function refreshGui() {
		if (guiList) guiList.dispose();

		const options = [...buffers.values()].reverse().reduce((p, c) => ((p[c] = c), p), {});

		guiList = gui.addInput(currentBuffer, 'name', {
			index: 0,
			label: 'Preview',
			options,
		});

		const current = sessionStorage.getItem('fbo_current');
		if (current != null && Object.values(options).includes(current)) {
			currentBuffer.name = current;
			guiList.refresh();
		}

		guiList.on('change', (v) => toggleDebug(v.value));
	}

	function toggleDebug(v) {
		sessionStorage.setItem('fbo_current', v);
	}

	function registerBuffer(name, buffer) {
		init();
		if (buffers.has(buffer) || buffersByName.has(name)) return;
		buffers.set(buffer, name);
		buffersByName.set(name, buffer);
		refreshGui();
	}

	function unregisterBuffer(name) {
		init();
		if (!name || name === 'None') return;
		if (buffersByName.has(name)) {
			buffers.delete(buffersByName.get(name));
			buffersByName.delete(name);
		} else if (buffers.has(name)) {
			buffersByName.delete(buffers.get(name));
			buffers.delete(name);
		}
		refreshGui();
	}
	/// #endif
}

export { createFboPlugin };
export default createFboPlugin;
