import getCommonDefines from '@webgl/shaders/commonDefines';
import getCommonUniforms from '@webgl/shaders/commonUniforms';
import loadChunks from '@webgl/shaders/_chunks/_load';

import Particles from './components/particles/Particles';
import Raycast from './components/Raycaster';

import Scene from './components/Scene';

let isInit = false;

export default function createWebgl(webgl) {
	loadChunks();

	let scene, raycaster, particles;

	Object.assign(webgl, { init, preload, load, start, update, render, resize });

	async function init() {
		webgl.$renderer.init();
		webgl.$renderer.instance.setClearColor(0xff0000, 1);

		getCommonUniforms(webgl);
		getCommonDefines(webgl);

		scene = webgl.scene = new Scene();
		raycaster = webgl.raycaster = new Raycast();
		// particles = webgl.particles = new Particles();

		webgl.raycastingObjects = [];

		isInit = true;
	}

	async function preload() {
		await webgl.$resources.preload();
	}

	function load() {}

	function resize() {
		if (!isInit) return;

		const { size, ratio, pixelRatio } = webgl.$viewport;
		webgl.uniforms.res.value.set(size.value.x, size.value.y, pixelRatio.value, ratio.value);

		scene.resize();
	}

	async function start() {
		webgl.$renderer.resize();
		webgl.$time.init();

		scene.triggerInit();
		raycaster.triggerInit();
		// particles.triggerInit();
	}

	function update() {
		webgl.uniforms.time.value += webgl.$time.dt;

		if (scene) scene.triggerUpdate();
		if (raycaster) raycaster.triggerUpdate();
		// if (particles) particles.triggerUpdate();
	}

	function render() {
		if (scene) scene.triggerRender();
	}
}
