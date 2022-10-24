import { createWebgl } from '@cafe-noisette/philbin/webgl';
import decorator from '@webgl/webgl';
import plugins from '@webgl/plugins';

export function loadWebgl(opts = {}) {
	return createWebgl({
		decorator,
		plugins,
		...opts,
	});
}
