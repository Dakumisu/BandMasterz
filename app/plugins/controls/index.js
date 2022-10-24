import keyboard from './keyboard';
import touch from './touch';

let singleton;

function createControlsPlugin(opts = {}) {
	const { logger } = opts;
	const api = (singleton = {
		listen,
		poll,
		touch: touch(),
		keyboard: keyboard(),
		install,
	});

	return api;

	function listen() {
		api.touch.listen();
		api.keyboard.listen();
	}

	function poll() {
		api.touch.poll();
	}

	function install(app) {
		app.config.globalProperties.$controls = api;
		app.provide('controls', api);
		app.$controls = api;

		/// #if DEBUG && typeof VUE_LOG_LIFECYCLE !== "undefined" && VUE_LOG_LIFECYCLE
		/// #code logger.log('Init Controls');
		/// #endif

		delete api.install;
	}
}

function useControls() {
	return getCurrentInstance() ? inject('controls') : singleton;
}

export default createControlsPlugin;
export { createControlsPlugin, useControls };
