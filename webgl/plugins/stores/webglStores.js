import colors from './colors';

export default function webglStores(webgl, opts = {}) {
	const { logger, name } = opts;

	const stores = (webgl[name] = {
		colors,
	});
}
