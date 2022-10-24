import defaultPlugins from '@cafe-noisette/philbin/vue/plugins';
import createWebglPlugin from './webgl';

/* prettier-ignore */
const list = [
	...defaultPlugins,
	[createWebglPlugin, 'webgl']
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
