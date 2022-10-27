import { wait } from '@cafe-noisette/philbin/utils/async';
import { prng } from '@cafe-noisette/philbin/utils/maths';
import { s } from '@cafe-noisette/philbin/utils/state';
import * as Tone from 'tone';
import { watch } from 'vue';
import { samples } from './samples';

const KEYS_WHITELIST = [
	['KeyC', 'E5'],
	['KeyV', 'F5'],
].reduce((p, v) => ((p[v[0]] = v[1]), p), {});

export function createDrum() {
	const reverb = new Tone.Reverb(0.6).toDestination();
	const stero = new Tone.StereoWidener(0.6).toDestination();

	const api = {
		init,

		snare: snare(),
		randomSnare,

		hit: s(),
		release: s(),

		samples: samples.drum,
		sampler: null,

		/// #if DEBUG
		devtools,
		/// #endif
	};

	// app.$controls.keyboard.watchKeys(Object.keys(KEYS_WHITELIST), (key, value) => {
	// 	const note = KEYS_WHITELIST[key];
	// 	value ? api.snare.hit({ note, emit: true }) : api.snare.release({ note, emit: true });
	// });

	return api;

	async function init() {
		api.sampler = await app.$audio.tone.load({
			instruments: 'drum',
		});

		api.sampler.toDestination();
		api.sampler.connect(reverb);
		api.sampler.connect(stero);
	}

	function snare() {
		return {
			hit: async ({ note, key, delay = 0, emit = false } = {}) => {
				if (!note && !key) return;

				note = note || KEYS_WHITELIST[key];

				if (emit) api.hit.emit();
				await wait(delay);
				// if (Array.isArray(note)) {
				// 	note.map((n) => {
				// 		const midi = Tone.Frequency(n).toMidi();
				// 		api.sampler.triggerAttack(Tone.Frequency(midi, 'midi').toNote());
				// 	});
				// } else {
				// 	const midi = Tone.Frequency(note).toMidi();
				// 	api.sampler.triggerAttack(Tone.Frequency(midi, 'midi').toNote());
				// }
				const midi = Tone.Frequency(note).toMidi();
				api.sampler.triggerAttack(Tone.Frequency(midi, 'midi').toNote());
				// if (autoRelease) api.snare.release({ note, delay: 200 });
			},
			release: async ({ note, key, delay = 0, emit = false } = {}) => {
				if (!note && !key) return;

				note = note || KEYS_WHITELIST[key];

				if (emit) api.release.emit();
				await wait(delay);
				const midi = Tone.Frequency(note).toMidi();
				api.sampler.triggerRelease(Tone.Frequency(midi, 'midi').toNote());
			},
		};
	}

	async function randomSnare({ delay = 0, emit = false } = {}) {
		// const severalKeys = prng.randomFloat(0, 1) > 0.85;
		// let notes;

		// if (severalKeys) {
		// 	const numberOfKeys = prng.randomInt(2, 3);
		// 	notes = [...Array(numberOfKeys)].map(getRandomNote);
		// } else {
		// 	notes = getRandomNote();
		// }
		const note = getRandomNote();

		await api.snare.hit({ delay, note, emit });
	}

	function getRandomNote() {
		const note = Object.keys(api.samples)[
			prng.randomInt(0, Object.keys(api.samples).length - 1)
		];
		return note;
	}

	/// #if DEBUG
	function devtools(gui) {
		gui.addButton({ title: 'Snare' }).on('click', snare);
		gui.addButton({ title: 'Random Snare' }).on('click', randomSnare);
	}
	/// #endif
}
