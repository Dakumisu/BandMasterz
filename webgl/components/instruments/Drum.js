import { throttle } from '@cafe-noisette/philbin/utils/async';
import { easings, getEase } from '@cafe-noisette/philbin/utils/easing';
import { dampPrecise } from '@cafe-noisette/philbin/utils/maths';
import { raf } from '@cafe-noisette/philbin/utils/raf';
import { DrumMat, DrumTopMat } from '@webgl/shaders/materials';
import { easeOutBounce } from '@webgl/utils/easings';
import { Group } from 'three';
import BaseInstrument from './BaseInstrument';

class Drum extends BaseInstrument {
	init() {
		const model = this.webgl.models.drum;
		this.log(model);
		const mat = DrumMat.use();

		const group = new Group();

		const drum = (group.drum = model.get('drum'));
		const drumTop = model.get('top');
		drum.traverse((child) => {
			if (child.material) child.material = mat;
		});
		drumTop.material = DrumTopMat.use();

		const drumsticks = (group.drumsticks = model.get('drumstick', true));
		drumsticks.map((drumstick) => {
			drumstick.material = mat;
			drumstick.update = null;
		});

		group.add(...[drum, ...drumsticks]);

		this.audio = this.webgl.$app.$audio.tone.drum;

		Object.assign(this, {
			model,
			group,
			base: group,
			drum,
			drumTop,
			drumsticks,
			currentDrumstick: 0,
		});

		this.base.rotateY(Math.PI * 0.15);

		this.animeDrumstick = throttle(this.animeDrumstick.bind(this), 100, { leading: true });
	}

	animeDrumstick() {
		const drumstick = this.drumsticks[this.currentDrumstick];
		this.currentDrumstick = this.currentDrumstick === 0 ? 1 : 0;
		if (drumstick.update) raf.remove(drumstick.update);

		const releaseEase = getEase(easings.inSine);
		const pressEase = easeOutBounce;
		let state = drumstick.morphTargetInfluences[0];
		let target = state;
		let isPressing = false;

		const press = () => {
			target = 1;
			isPressing = true;
			raf.add(update);
		};

		const release = () => {
			target = 0;
			isPressing = false;
			raf.add(update);
		};

		const update = (drumstick.update = () => {
			const dt = this.webgl.$time.dt;
			const smoothing = isPressing ? 0.15 : 0.25;
			state = dampPrecise(state, target, smoothing, dt, 0.03);
			const a = (drumstick.morphTargetInfluences[0] = target
				? pressEase(state)
				: releaseEase(state));

			this.drumTop.material.uniforms.kickAlpha.value = a;
			this.drumTop.material.uniforms.kickSide.value[this.currentDrumstick] = a;

			if (a === state && state === target) {
				if (target === 0) {
					raf.remove(update);
					drumstick.update = null;
				} else {
					release();
				}
			}
		});

		press();
	}

	beat() {
		this.animeDrumstick();
		this.audio.kick();
	}

	devtools() {
		this.gui = this.webgl.$app.$gui.addFolder({ title: 'Drum', index: 1 });
		super.devtools();

		this.gui.addButton({ title: 'Beat' }).on('click', () => this.beat());
	}
}

export { Drum };
export default Drum;
