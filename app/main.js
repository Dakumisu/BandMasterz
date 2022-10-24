import '@app/style/main.scss';

import { createApp, onDOMReady } from '@cafe-noisette/philbin/vue/app';
import { installPlugins } from '@app/plugins';
import project from '@config/project';

import App from './App.vue';

/// #if DEBUG
/// #code import { createLogger } from '@cafe-noisette/philbin/utils/debug';
/// #code const { log } = createLogger('Halpert', '#000', '#cdb4db');
/// #code log(ENVIRONMENT + ' 🔥');
/// #endif

const app = createApp(App);

onDOMReady(async () => {
	// Install all plugins
	await installPlugins(app, {
		i18n: {
			data: import.meta.globEager('/config/i18n/*.yaml'),
		},
		stores: {
			data: import.meta.globEager('/src/stores/*.js'),
		},
		svgIcon: {
			data: import.meta.globEager('/src/assets/svg/*.svg'),
		},
	});

	// Wait for the preloader to be finished
	await app.$preloader.finished;

	app.$controls.listen();
	app.$audio.listen();

	await app.$audio.load('/assets/audio/music.mp3', 'music');
	const sample = app.$audio.get('music');
	// app.$audio.play(sample, { loop: true });

	// Start app
	app.mount('#app');
});
