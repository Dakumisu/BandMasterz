import { app, app as _app } from '@cafe-noisette/philbin/vue/app';
import audioAnalyser from './analyser';
import audioManager from './manager';
import audioTone from './tone';

/// #if DEBUG
/// #code import { createLogger } from '@cafe-noisette/philbin/utils/debug';
/// #endif
const log = DEBUG ? createLogger('Audio Manager', '#fff', '#9e00de').log : () => {};

let singleton;

function createAudioPlugin(opts = {}) {
	const { logger } = opts;

	const manager = audioManager();
	const analyser = audioAnalyser({ analyser: manager.analyser });
	const tone = audioTone();

	const api = (singleton = {
		manager,
		analyser,
		tone,

		load: manager.load,
		play: manager.play,
		pause: manager.pause,
		resume: manager.resume,
		stop: manager.stop,

		getSample: manager.getSample,
		get: manager.getSample,
		getLabel: manager.getLabel,

		listen,

		install,
	});

	/// #if DEBUG
	devtools();

	function devtools() {
		const gui = _app.$gui.addFolder({ title: 'Audio Manager' });

		manager.devtools(gui);
		analyser.devtools(gui);
		tone.devtools(gui);
	}
	/// #endif

	return api;

	function listen() {
		api.analyser.listen();
	}

	async function install(app) {
		app.provide('audio', api);
		app.config.globalProperties.$audio = api;
		app.$audio = api;

		await api.tone.init();

		log(api);

		/// #if DEBUG && typeof VUE_LOG_LIFECYCLE !== "undefined" && VUE_LOG_LIFECYCLE
		/// #code logger.log('Init Audio');
		/// #endif

		delete api.install;
	}
}

function useAudio() {
	return getCurrentInstance() ? inject('audio') : singleton;
}

export { createAudioPlugin, useAudio };
export default createAudioPlugin;
