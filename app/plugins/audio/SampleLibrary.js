/**
 * @fileoverview A sample library and quick-loader for tone.js
 *
 * @author N.P. Brosowsky (nbrosowsky@gmail.com)
 * https://github.com/nbrosowsky/tonejs-instruments
 */

import { app } from '@cafe-noisette/philbin/vue/app';
import * as Tone from 'tone';
import { samples } from './instruments/samples';

const SampleLibrary = {
	minify: false,
	ext: '.wav', // use setExt to change the extensions on all files // do not change this variable //
	baseUrl: 'assets/audio/samples/',
	list: Object.keys(samples),
	onload: null,

	setExt: function (newExt) {
		let i;
		for (i = 0; i <= this.list.length - 1; i++) {
			for (let property in this[this.list[i]]) {
				this[this.list[i]][property] = this[this.list[i]][property].replace(
					this.ext,
					newExt,
				);
			}
		}
		this.ext = newExt;
		return console.log('sample extensions set to ' + this.ext);
	},

	load: async function (arg) {
		const tasks = [];

		return new Promise(async (resolve, reject) => {
			let t, rt, i, newT;
			arg ? (t = arg) : (t = {});

			t.instruments = t.instruments || this.list;
			t.baseUrl = t.baseUrl || this.baseUrl;
			t.onload = t.onload || this.onload;

			// update extensions if arg given
			if (t.ext) {
				if (t.ext != this.ext) {
					this.setExt(t.ext);
				}
				t.ext = this.ext;
			}

			rt = {};

			// if an array of instruments is passed...
			if (Array.isArray(t.instruments)) {
				for (i = 0; i <= t.instruments.length - 1; i++) {
					newT = this[t.instruments[i]];
					//Minimize the number of samples to load
					if (this.minify === true || t.minify === true) {
						let minBy = 1;
						if (Object.keys(newT).length >= 17) {
							minBy = 2;
						}
						if (Object.keys(newT).length >= 33) {
							minBy = 4;
						}
						if (Object.keys(newT).length >= 49) {
							minBy = 6;
						}

						let filtered = Object.keys(newT).filter(function (_, i) {
							return i % minBy != 0;
						});
						filtered.forEach(function (f) {
							delete newT[f];
						});
					}

					// tasks.push(
					// 	new Tone.Sampler(newT, {
					// 		baseUrl: t.baseUrl + t.instruments[i] + '/',
					// 		onload: () => resolve(rt),
					// 	})
					// )

					rt[t.instruments[i]] = await new Tone.Sampler(newT, {
						baseUrl: t.baseUrl + t.instruments[i] + '/',
						onload: async () => await resolve(rt[t.instruments[i]]),
					});

					return rt;
				}
			} else {
				let newT = this[t.instruments];

				// if a single instrument name is passed...
				//Minimize the number of samples to load
				if (this.minify === true || t.minify === true) {
					minBy = 1;
					if (Object.keys(newT).length >= 17) {
						minBy = 2;
					}
					if (Object.keys(newT).length >= 33) {
						minBy = 4;
					}
					if (Object.keys(newT).length >= 49) {
						minBy = 6;
					}

					filtered = Object.keys(newT).filter(function (_, i) {
						return i % minBy != 0;
					});
					filtered.forEach(function (f) {
						delete newT[f];
					});
				}

				let s = new Tone.Sampler(newT.samples, {
					baseUrl: t.baseUrl + t.instruments + '/',
					onload: async () => await resolve(s),
				});

				return s;

				// tasks.push(
				// 	new Tone.Sampler(newT, {
				// 		baseUrl: t.baseUrl + t.instruments + '/',
				// 		onload: () => resolve(s),
				// 	})
				// )
			}
		});

		// tasks.forEach((v) => app.$preloader.task(v));
	},
};

export { SampleLibrary };
export default SampleLibrary;
