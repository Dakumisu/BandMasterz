import { getCurrentInstance, inject } from 'vue';
import WebglVue from './Webgl.vue';
import { deferredPromise } from '@cafe-noisette/philbin/utils/async';

/// #if typeof WEBGL_ASYNC !== "undefined" && WEBGL_ASYNC
/// #code const getloadWebgl = import('./webgl.js');
/// #else
import { loadWebgl } from './webgl.js';
/// #code import * as THREE from 'three';
/// #endif

let singleton = null;

function createWebglPlugin(opts = {}) {
	const { logger } = opts;

	let canvas;
	let webgl;

	let isReady = false;
	let readyListeners = [];

	const api = (singleton = new Proxy({}, { get: proxyGet }));

	const mainApi = {
		onReady,

		get isReady() {
			return isReady;
		},
		get canvas() {
			return canvas;
		},
	};

	function ready() {
		isReady = true;
		for (let i = 0; i < readyListeners.length; i++) readyListeners[i](api);
		readyListeners.length = 0;
	}

	function onReady(cb) {
		if (isReady) cb(api);
		else readyListeners.push(cb);
	}

	function proxyGet(_, prop) {
		if (mainApi[prop]) return mainApi[prop];
		if (webgl) return webgl[prop];
		else return undefined;
	}

	return function install(app) {
		app.component('Webgl', WebglVue);
		app.provide('webgl', api);
		app.config.globalProperties.$webgl = api;
		app.$webgl = api;

		canvas = document.createElement('canvas');

		/// #if DEBUG && typeof WEBGL_LOG_LIFECYCLE !== "undefined" && WEBGL_LOG_LIFECYCLE
		/// #code logger.log('Init Webgl');
		/// #endif

		const preloader = app.$preloader;
		if (!preloader) return;

		const webglReady = deferredPromise();
		preloader.task(
			async () => {
				/// #if typeof WEBGL_ASYNC !== 'undefined' && WEBGL_ASYNC
				/// #code const { loadWebgl } = await getloadWebgl;
				/// #endif

				webgl = loadWebgl({ app, canvas });

				ready();

				await webgl.init();
				await webgl.preload();

				webglReady.resolve();
			},
			{ weight: 3 },
		);

		// Start webgl before exiting preloader
		preloader.beforeExit(async () => {
			await webglReady;
			await webgl.start();
			await webgl.prerender();
		});
	};
}

function useWebgl() {
	return getCurrentInstance() ? inject('webgl') : singleton;
}

export default createWebglPlugin;
export { createWebglPlugin, useWebgl };
