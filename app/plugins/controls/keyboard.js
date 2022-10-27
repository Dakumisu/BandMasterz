import { app } from '@cafe-noisette/philbin/vue/app';
import { markRaw, reactive, ref, watch } from 'vue';

const MUSIC_KEYS = ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB'];
// all keys of the keyboard
const KEYBOARD_KEYS = [
	'KeyA',
	'KeyB',
	'KeyC',
	'KeyD',
	'KeyE',
	'KeyF',
	'KeyG',
	'KeyH',
	'KeyI',
	'KeyJ',
	'KeyK',
	'KeyL',
	'KeyM',
	'KeyN',
	'KeyO',
	'KeyP',
	'KeyQ',
	'KeyR',
	'KeyS',
	'KeyT',
	'KeyU',
	'KeyV',
	'KeyW',
	'KeyX',
	'KeyY',
	'KeyZ',
];

const WHITELIST_KEYS = [
	// ...MUSIC_KEYS,
	...KEYBOARD_KEYS,
	'Space',
	'ArrowUp',
	'ArrowDown',
	'ArrowLeft',
	'ArrowRight',
].reduce((p, v) => ((p[v] = 1), p), {});

const BLACKLIST_TAG_NAMES = ['TEXTAREA', 'INPUT', 'SELECT'].reduce((p, v) => ((p[v] = 1), p), {});

function canBypass(el) {
	if (!el) return false;
	const tagName = el.tagName;

	const test = BLACKLIST_TAG_NAMES[tagName];

	if (test) return true;
	if (el.dataset && el.dataset.bypassKeyboard != null) return true;

	/// #if DEBUG
	// if (!gui) gui = document.querySelector('.debug');
	// if (gui && gui.contains(el)) return true;
	if (el.dataset && el.dataset.bypassTouch) return true;
	// if (app.$webgl.$debugCamera && app.$webgl.$debugCamera.enabled.value) return true;
	// if (webgl.scene.debugCam.enabled.value) return true;
	/// #endif

	return false;
}

export function allowEvent(e) {
	if (!e) return false;
	if (!e.target) return true;
	if (canBypass(e.target)) return false;
	return true;
}

export default function keyboard() {
	const keys = Object.keys(WHITELIST_KEYS).reduce((p, v) => ((p[v] = ref(false)), p), {});

	const api = reactive({
		pressedCount: 0,
		keys,
		unpressAllKeys: markRaw(unpressAllKeys),
		listen: markRaw(listen),

		watchKey,
		watchKeys,
	});

	unpressAllKeys();
	api.pressedCount = 0;

	return api;

	function watchKey(key, cb) {
		return watch(
			() => keys[key].value,
			(v) => cb(key, v),
		);
	}

	function watchKeys(keys, cb) {
		return keys.map((key) => watchKey(key, cb));
	}

	function listen() {
		const opts = { passive: false };

		window.addEventListener('keydown', onKeyDown, opts);
		window.addEventListener('keyup', onKeyUp, opts);

		// Reset key presses on some events
		window.addEventListener('blur', unpressAllKeys, false);
		window.addEventListener('contextmenu', unpressAllKeys, false);

		// watch(() => app.$stores.isMenuOpen, unpressAllKeys);
	}

	function onKeyDown(event) {
		if (!WHITELIST_KEYS[event.code]) return;
		if (!allowEvent(event)) return;
		event.preventDefault();
		pressKey(event.code);
	}

	function onKeyUp(event) {
		if (!WHITELIST_KEYS[event.code]) return;
		unpressKey(event.code);
	}

	function pressKey(code) {
		if (keys[code].value) return;
		keys[code].value = true;
		api.pressedCount++;
	}

	function unpressKey(code) {
		if (!keys[code].value) return;
		keys[code].value = false;
		api.pressedCount = Math.max(api.pressedCount - 1, 0);
	}

	function unpressAllKeys() {
		for (let k in keys) unpressKey(k);
	}
}
