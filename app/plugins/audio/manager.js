import { app } from '@cafe-noisette/philbin/vue/app';
import { ref, watch } from 'vue';

/// #if DEBUG
/// #code import { createLogger } from '@cafe-noisette/philbin/utils/debug';
/// #endif
const logger = DEBUG ? createLogger('Audio Manager', '#fff', '#9e00de') : () => {};

const STATES = {
	PLAYING: 'playing',
	PAUSED: 'paused',
	STOPPED: 'stopped',
};

function audioManager(opts = {}) {
	let offsetTime = 0;
	let pauseTime = 0;
	let lastSample = null;
	let sampleSourceNode = null;

	const audioCtx = new AudioContext();
	const analyser = audioCtx.createAnalyser();

	const gain = ref(0);
	const gainNode = audioCtx.createGain();
	gainNode.connect(audioCtx.destination);

	watch(
		gain,
		(value) => {
			console.log('gain', value);
			gainNode.gain.value = value;
		},
		{ immediate: true },
	);

	const api = {
		audioCtx,
		analyser,

		states: STATES,
		state: ref(STATES.STOPPED),

		gain,

		samples: {
			list: {},
			current: null,
		},

		load,
		play,
		pause,
		resume,
		stop,

		getSample,
		get: getSample,
		getLabel,

		/// #if DEBUG
		devtools,
		/// #endif
	};

	return api;

	function getSample(label) {
		return api.samples.list[label];
	}

	function getLabel(sample) {
		return Object.keys(api.samples.list).find((key) => api.samples.list[key] === sample);
	}

	async function play(sample, { reset = true, loop = false } = {}) {
		if (api.state === STATES.PLAYING) return;

		if (!sample) {
			logger.error('No sample provided');
			return;
		}
		if (typeof sample === 'string') sample = getSample(sample);
		if (!sample) {
			logger.error('Sample not found');
			return;
		}

		api.state = STATES.PLAYING;
		lastSample = sample;

		offsetTime = reset ? audioCtx.currentTime : audioCtx.currentTime - pauseTime;

		sampleSourceNode = audioCtx.createBufferSource();
		sampleSourceNode.buffer = sample;
		sampleSourceNode.connect(audioCtx.destination);
		sampleSourceNode.connect(analyser);
		sampleSourceNode.connect(gainNode);
		sampleSourceNode.start(0, reset ? 0 : pauseTime);

		return new Promise((resolve) => {
			sampleSourceNode.onended = () => {
				if (api.state !== STATES.PLAYING) return;
				logger.log('Sample ended');
				stop();
				if (loop) play(sample, { reset: true, loop });
				resolve();
			};
		});

		logger.log('start ' + getLabel(sample));

		return sampleSourceNode;

		return new Promise((resolve) => {
			source.node.onended = () => {
				logger.log('ON PLAY END', source);
				resolve();
			};
		});
	}

	function pause() {
		if (api.state !== STATES.PLAYING) return;

		api.state = STATES.PAUSED;
		pauseTime = audioCtx.currentTime - offsetTime;

		sampleSourceNode.stop(0);
		sampleSourceNode.disconnect(audioCtx.destination);
		sampleSourceNode.disconnect(analyser);
	}

	function resume() {
		if (api.state !== STATES.PAUSED) return;

		offsetTime = audioCtx.currentTime - pauseTime;

		play(lastSample, { reset: false });
	}

	if (this.state === 'stopped') return;

	function stop() {
		if (api.state === STATES.STOPPED) return;

		if (api.state !== STATES.PAUSED && sampleSourceNode) {
			sampleSourceNode.stop(0);
			sampleSourceNode.disconnect(audioCtx.destination);
			sampleSourceNode.disconnect(analyser);
		}

		api.state = STATES.STOPPED;

		sampleSourceNode = null;
		pauseTime = offsetTime = 0;
	}

	async function load(url, label) {
		const response = await fetch(url);
		const ab = await response.arrayBuffer();
		const audio = (api.samples.list[label] = await audioCtx.decodeAudioData(ab));

		logger.log('sample ' + label + ' loaded');

		return audio;
	}

	/// #if DEBUG
	function devtools(gui) {
		if (Object.values(api.samples.list).length)
			gui.addInput(api.samples, 'list', {
				label: 'Samples List',
				options: {
					choices: Object.values(api.samples.list),
				},
			}).on('change', (value) => {
				api.samples.current = value;
			});

		gui.addButton({
			title: 'Play',
		}).on('click', () => {
			api.play('music');
		});

		gui.addButton({
			title: 'Pause',
		}).on('click', () => {
			api.pause();
		});

		gui.addButton({
			title: 'Resume',
		}).on('click', () => {
			api.resume();
		});

		gui.addButton({
			title: 'Stop',
		}).on('click', () => {
			api.stop();
		});

		gui.addInput(api.gain, 'value', {
			label: 'Gain',
			min: -1,
			max: 2,
			step: 0.01,
			reactive: true,
		});
	}
	/// #endif
}

export { audioManager };
export default audioManager;
