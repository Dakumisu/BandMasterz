import { raf } from '@cafe-noisette/philbin/utils/raf';
import { ref } from 'vue';

/// #if DEBUG
/// #code import { createLogger } from '@cafe-noisette/philbin/utils/debug';
/// #endif
const log = DEBUG ? createLogger('Audio Analyser', '#fff', '#fe00de').log : () => {};

function audioAnalyser(opts = {}) {
	const { analyser } = opts;

	const FFT_SIZE = 2048;
	const SPECTRUM_PRECISION = 7;
	const SMOOTHING_FACTOR = 0.8;
	const spectrum = new Array(SPECTRUM_PRECISION).fill(0);
	const PCMData = new Float32Array(FFT_SIZE);

	const api = {
		analyser,

		FFT_SIZE,
		SPECTRUM_PRECISION,

		gain: ref(1),
		volume: 0,

		spectrum,
		PCMData,

		listen,
		stop,
		analyse,

		/// #if DEBUG
		devtools,
		/// #endif
	};

	return api;

	function listen() {
		raf.add(analyse);
	}

	function stop() {
		raf.remove(analyse);
	}

	function analyse() {
		analyser.getFloatTimeDomainData(PCMData);

		let sumSquares = 0;
		for (const amplitude of PCMData) sumSquares += amplitude * amplitude;
		let volume = Math.sqrt(sumSquares / PCMData.length);
		api.volume = volume * SMOOTHING_FACTOR;

		getFrenquencies();
	}

	function getFrenquencies() {
		return spectrum.reduce(
			(acc, v, i) => (
				(acc[i] =
					PCMData[
						Math.trunc(
							FFT_SIZE * 0.5 * (i / (SPECTRUM_PRECISION - 1)) -
								(i / (SPECTRUM_PRECISION - 1) === 1 ? 1 : 0),
						) * api.gain.value
					]),
				acc
			),
			spectrum,
		);
	}

	/// #if DEBUG
	function devtools(gui) {}
	/// #endif
}

export { audioAnalyser };
export default audioAnalyser;
