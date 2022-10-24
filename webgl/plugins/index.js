import defaultPlugins from '@cafe-noisette/philbin/webgl/plugins';
import createWebglStoresPlugin from '@webgl/plugins/stores/webglStores';

// prettier-ignore
const list = [
	...defaultPlugins,
	[createWebglStoresPlugin, 'stores']
];

export default list;
