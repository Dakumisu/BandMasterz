import { map } from '@cafe-noisette/philbin/utils/maths';
import { app } from '@cafe-noisette/philbin/vue/app';
import { markRaw, reactive } from 'vue';

let gui;

const BLACKLIST_TAG_NAMES = ['INPUT', 'SELECT', 'TEXTAREA', 'A', 'BUTTON'].reduce(
	(p, v) => ((p[v] = 1), p),
	{},
);

const HAS_VISUAL_VIEWPORT =
	typeof window.visualViewport !== 'undefined' &&
	typeof window.visualViewport.scale !== 'undefined';

function canBypass(el) {
	if (!el) return false;
	const tagName = el.tagName;

	const test =
		BLACKLIST_TAG_NAMES[tagName] || (HAS_VISUAL_VIEWPORT && window.visualViewport.scale !== 1);

	if (test) return true;
	if (el.dataset && el.dataset.bypassTouch != null) return true;

	/// #if DEBUG
	if (!gui) gui = document.querySelector('.debug');
	if (gui && gui.contains(el)) return true;
	// if (app.$webgl.$debugCamera && app.$webgl.$debugCamera.enabled.value) return true;
	/// #endif

	return false;
}

function allowEvent(e) {
	if (!e) return false;
	if (!e.target) return true;
	if (canBypass(e.target)) return false;

	return true;
}

// Used to dedupe touch/mouse event
let isPrimaryTouch, primaryTouchTimer;
let startTouchAt = 0;

const resetPrimaryTouch = () => (isPrimaryTouch = false);
function setPrimaryTouch() {
	isPrimaryTouch = true;
	clearTimeout(primaryTouchTimer);
	primaryTouchTimer = setTimeout(resetPrimaryTouch, 200);
}

export default function touch() {
	const firstPos = { x: 0, y: 0 };
	const prevPos = { x: 0, y: 0 };
	const pos = { x: 0, y: 0 };
	const relativePos = { x: 0, y: 0 };
	const delta = { x: 0, y: 0 };
	const normalizePos = { x: 0, y: 0 };
	const normalizeRelativePos = { x: 0, y: 0 };

	let needsClickIn = false;
	let needsClickOut = false;

	const state = reactive({
		clickIn: false,
		clickOut: false,
		useTouch: false,
		canHover: false,
		pressed: false,
		firstPos,
		prevPos,
		pos,
		relativePos,
		delta,
		normalizePos,
		normalizeRelativePos,
		swipe: '',
		side: '',
		listen: markRaw(listen),
		poll: markRaw(poll),
	});

	return state;

	function getTouch(e) {
		return e.changedTouches[0];
	}

	function getPosSide(pos) {
		return pos > app.$viewport.width * 0.5 ? 'RIGHT' : 'LEFT';
	}

	function onStart(e) {
		const isTouch = !!e.changedTouches;

		if (isTouch) setPrimaryTouch();
		else if (isPrimaryTouch) return;
		if (!isTouch && e.button !== 0) return;
		if (allowEvent(e)) e.preventDefault();
		else return;

		startTouchAt = performance.now();
		state.swipe = '';

		const o = isTouch ? getTouch(e) : e;
		state.useTouch = isTouch || isPrimaryTouch;
		if (state.useTouch) state.canHover = false;

		state.pressed = true;
		delta.x = delta.y = 0;
		pos.x = prevPos.x = firstPos.x = o.clientX;
		pos.y = prevPos.y = firstPos.y = o.clientY;

		state.side = getPosSide(pos.x);

		needsClickOut = false;
		needsClickIn = true;

		updateNormalizePos();
	}

	function onMove(e) {
		const isTouch = !!e.changedTouches;
		const o = isTouch ? getTouch(e) : e;
		state.useTouch = isTouch || isPrimaryTouch;

		if (state.useTouch) state.canHover = false;
		else if (!state.pressed) state.canHover = true;

		pos.x = o.clientX || 0;
		pos.y = o.clientY || 0;

		updateNormalizePos();
	}

	function onEnd(e) {
		const isTouch = !!e.changedTouches;

		if (isTouch) setPrimaryTouch();
		else if (isPrimaryTouch) return;

		if (!isTouch && e.button !== 0) return;

		if (allowEvent(e)) e.preventDefault();
		else if (!state.pressed) return;

		if (isTouch) {
			const time = performance.now() - startTouchAt;
			let swipe = '';
			const bleed = 3;

			// Swipe time limit
			if (time < 220) {
				const px = state.relativePos.x;
				const py = state.relativePos.y;
				const ang = (Math.atan2(py, px) * 180) / Math.PI + 90;
				if (ang >= -45 + bleed && ang < 45 - bleed) swipe = 'up';
				else if (ang >= 45 + bleed && ang < 135 - bleed) swipe = 'right';
				else if (ang >= 135 + bleed && ang < 225 - bleed) swipe = 'down';
				else if (ang >= 225 + bleed || ang < -45 - bleed) swipe = 'left';
			}

			state.swipe = swipe;
		} else {
			state.swipe = '';
		}

		const o = isTouch ? getTouch(e) : e;
		state.useTouch = isTouch || isPrimaryTouch;
		if (state.useTouch) state.canHover = false;
		state.pressed = false;

		pos.x = o.clientX || 0;
		pos.y = o.clientY || 0;

		updateNormalizePos();

		needsClickOut = true;
		needsClickIn = false;
	}

	function updateNormalizePos() {
		if (state.pressed) {
			relativePos.x = pos.x - firstPos.x;
			relativePos.y = pos.y - firstPos.y;
		} else {
			relativePos.x = relativePos.y = 0;
		}

		const vpw = app.$viewport.width;
		const vph = app.$viewport.height;
		normalizePos.x = map(pos.x, 0, vpw, -1, 1);
		normalizePos.y = map(pos.y, 0, vph, 1, -1);
		normalizeRelativePos.x = relativePos.x / vpw;
		normalizeRelativePos.y = relativePos.y / vph;
	}

	function poll() {
		delta.x = pos.x - prevPos.x;
		delta.y = pos.y - prevPos.y;
		prevPos.x = pos.x;
		prevPos.y = pos.y;

		state.clickIn = needsClickIn;
		state.clickOut = needsClickOut;
		needsClickIn = needsClickOut = false;
	}

	function listen() {
		const e = 'addEventListener';
		const opts = { passive: false };

		window[e]('touchstart', onStart, opts);
		window[e]('touchmove', onMove, opts);
		window[e]('touchend', onEnd, opts);
		window[e]('touchcancel', onEnd, opts);
		window[e]('mousedown', onStart, opts);
		window[e]('mousemove', onMove, opts);
		window[e]('mouseup', onEnd, opts);
		window[e]('gesturestart', (e) => e.preventDefault(), opts);
	}
}
