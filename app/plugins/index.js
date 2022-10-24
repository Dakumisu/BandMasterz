import defaultPlugins from '@cafe-noisette/philbin/vue/plugins';
import createAudioPlugin from './audio';
import createControlsPlugin from './controls';
import createWebglPlugin from './webgl';

/* prettier-ignore */
const list = [
	...defaultPlugins,
	[createAudioPlugin, 'audio'],
	[createControlsPlugin, 'controls'],
	[createWebglPlugin, 'webgl'],
];

import { createLogger } from '@cafe-noisette/philbin/utils/debug';
const logger = createLogger('Vue', '#000', '#00cf9b');

async function installPlugins(app, opts = {}) {
	await Promise.all([
		...list.map(async (plugin) => {
			const [instance, name] = plugin;
			await app.use(instance(Object.assign({}, { ...opts[name], logger })));
		}),
	]);

	app.$plugins = app.config.globalProperties;
	return app.$plugins;
}

export { list as plugins, installPlugins };
