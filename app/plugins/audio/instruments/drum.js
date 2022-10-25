import { wait } from '@cafe-noisette/philbin/utils/async';
import * as Tone from 'tone';

export function createDrum() {
	// create an array with random drum's kick frequencies
	// const kickFrequencies = Array.from({ length: 16 }, () => Math.random() * 100 + 50);
	// console.log(kickFrequencies);

	const api = {
		kick,

		/// #if DEBUG
		devtools,
		/// #endif
	};

	return api;

	async function kick(delay = 0) {
		const synth = new Tone.MembraneSynth().toDestination();
		await wait(delay);
		synth.triggerAttackRelease('C1', 0.5);

		// const sampler = new Tone.Sampler({
		// 	urls: {
		// 		A1: 'A1.mp3',
		// 		A2: 'A2.mp3',
		// 	},
		// 	baseUrl: 'https://tonejs.github.io/audio/casio/',
		// 	onload: () => {
		// 		sampler.triggerAttackRelease(['C1', 'E1', 'G1', 'B1'], 0.5);
		// 	},
		// }).toDestination();
	}

	/// #if DEBUG
	function devtools(gui) {
		gui.addButton({ title: 'Kick' }).on('click', kick);
	}
	/// #endif
}
