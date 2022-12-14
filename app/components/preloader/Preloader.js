import { raf } from '@cafe-noisette/philbin/utils/raf';
import { deferredPromise, wait } from '@cafe-noisette/philbin/utils/async';
import { clamp, dampPrecise } from '@cafe-noisette/philbin/utils/maths';

import './Preloader.scss';

export default function Preloader(app, base) {
	const counter = base.querySelector('.preloader-counter');
	const bg = base.querySelector('.preloader-background');

	const progressFinished = deferredPromise();
	let progressTarget = 0;
	let progressCurrent = 0;

	function enter() {
		raf.add(update);
	}

	function onProgress(p) {
		// We only update the target progress
		// The update is done in an update function to lerp the progression
		// and make animations based on the progression
		progressTarget = p;
	}

	function update(dt) {
		// Update progression incrementation animation
		dt = clamp(dt, 5, 300);
		let newProgress = dampPrecise(progressCurrent, progressTarget, 0.17, dt);
		if (newProgress > 0.99) newProgress = 1;

		if (newProgress === progressCurrent) return;
		progressCurrent = newProgress;

		// Update DOM counter
		const num = Math.floor(progressCurrent * 100)
			.toString()
			.padStart(3, '0');
		counter.textContent = num;

		// When progress is finished, we mark the progression as finished
		if (progressCurrent >= 1) progressFinished.resolve();
	}

	async function exit(done) {
		// Wait for the incrementing counter to go to 100%
		await progressFinished;

		bg.style.transition = 'transform 1000ms cubic-bezier(0.910, 0.000, 0.195, 0.990)';
		bg.style.transform = 'scaleY(0)';
		bg.style.transformOrigin = 'top';
		await wait(400);
		counter.style.transition = 'opacity 200ms';
		counter.style.opacity = 0;
		await wait(100);

		// Calling done tell the app when the page can be visible
		// It is NOT when the preloader is destroyed !
		done();

		// Wait for all preloader css animations to finish
		await wait(1000);

		// The preloader is destroyed
	}

	// Called just before the preloader destruction
	function beforeDestroy() {
		raf.remove(update);
	}

	return { enter, onProgress, exit, beforeDestroy };
}
