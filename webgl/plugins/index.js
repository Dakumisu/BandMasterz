import defaultPlugins from '@cafe-noisette/philbin/webgl/plugins';
import createWebglStoresPlugin from '@webgl/plugins/stores/webglStores';
import createFboPlugin from './fbo';
import createResourcesPlugins from '@webgl/plugins/resources/resourcesPlugin';

const list = [
	...defaultPlugins,
	[createWebglStoresPlugin, 'stores'],
	[createFboPlugin, 'fbo'],
	[createResourcesPlugins, 'resources'],
];

export default list;
