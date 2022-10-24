import getCommonDefines from '@webgl/shaders/commonDefines';
import getCommonUniforms from '@webgl/shaders/commonUniforms';

import loadChunks from '@webgl/shaders/_chunks/_load';

import Scene from './components/Scene';

export default function createWebgl(webgl) {
	loadChunks();

	let scene;

	Object.assign(webgl, { init, preload, load, start, update, render, resize });

	async function init() {
		webgl.$renderer.init();
		webgl.$renderer.instance.setClearColor(0xff0000, 1);

		getCommonUniforms(webgl);
		getCommonDefines(webgl);

		scene = webgl.scene = new Scene();
		scene.triggerInit();
	}

	async function preload() {}

	function load() {}

	function resize() {}

	async function start() {
		webgl.$renderer.resize();
		webgl.$time.init();
	}

	function update() {
		if (scene) scene.triggerUpdate();
	}

	function render() {
		if (scene) scene.triggerRender();
	}
}
