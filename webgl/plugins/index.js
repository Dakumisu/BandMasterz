import defaultPlugins from '@cafe-noisette/philbin/webgl/plugins';
import createWebglStoresPlugin from '@webgl/plugins/stores/webglStores';
import createResourcesPlugins from '@webgl/plugins/resources/resourcesPlugin';

const list = [
	...defaultPlugins,
	[createWebglStoresPlugin, 'stores'],
	[createResourcesPlugins, 'resources'],
];

export default list;
