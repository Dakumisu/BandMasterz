import { createDrum } from './instruments';
import SampleLibrary from './SampleLibrary';

function audioTone(opts = {}) {
	const drum = createDrum();

	const api = {
		init,

		...SampleLibrary,

		instruments: {
			drum,
		},

		drum,

		/// #if DEBUG
		devtools,
		/// #endif
	};

	return api;

	async function init() {
		await drum.init();
	}

	/// #if DEBUG
	function devtools(_gui) {
		const gui = _gui.addFolder({ title: 'Tone' });

		drum.devtools(gui);
	}
	/// #endif
}

export { audioTone };
export default audioTone;
