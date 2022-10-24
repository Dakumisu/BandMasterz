import * as Tone from 'tone';
import { createDrum } from './instruments';

function audioTone(opts = {}) {
	const drum = createDrum();

	const api = {
		drum,

		/// #if DEBUG
		devtools,
		/// #endif
	};

	return api;

	/// #if DEBUG
	function devtools(_gui) {
		const gui = _gui.addFolder({ title: 'Tone' });

		drum.devtools(gui);
	}
	/// #endif
}

export { audioTone };
export default audioTone;
