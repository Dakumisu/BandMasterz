import { dampPrecise, lerp } from '@cafe-noisette/philbin/utils/maths';
import { raf } from '@cafe-noisette/philbin/utils/raf';
import { InstrumentMat } from '@webgl/shaders/materials';
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, MeshPhysicalMaterial } from 'three';
import BaseInstrument from './BaseInstrument';
import { easings, getEase } from '@cafe-noisette/philbin/utils/easing';
import { easeOutBounce } from '@webgl/utils/easings';

class Drum extends BaseInstrument {
	init() {
		const model = this.webgl.models.drum;
		const mat = InstrumentMat.use();
		const group = new Group();
		const drum = (group.drum = model.get('drum'));
		drum.material = mat;
		const drumsticks = (group.drumsticks = model.get('drumstick', true));
		drumsticks.map((drumstick) => {
			drumstick.material = mat;
			drumstick.update = null;
		});
		group.add(...[drum, ...drumsticks]);

		Object.assign(this, {
			model,
			group,
			base: group,
			drum,
			drumsticks,
		});

		this.base.rotateY(Math.PI * 1.25);
	}

	beat(drumstick) {
		if (drumstick.update) raf.remove(drumstick.update);

		const releaseEase = getEase(easings.outSwift);
		const pressEase = easeOutBounce;
		let state = drumstick.morphTargetInfluences[0];
		let target = state;

		const press = () => {
			target = 1;
			raf.add(update);
		};

		const release = () => {
			target = 0;
			raf.add(update);
		};

		const update = (drumstick.update = () => {
			const dt = this.webgl.$time.dt;
			state = dampPrecise(state, target, 0.15, dt);
			drumstick.morphTargetInfluences[0] = target ? pressEase(state) : releaseEase(state);

			if (drumstick.morphTargetInfluences[0] === state && state === target) {
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

	devtools() {
		this.gui = this.webgl.$app.$gui.addFolder({ title: 'Drum', index: 1 });
		super.devtools();

		this.gui
			.addButton({ title: 'Beat' })
			.on('click', () =>
				this.beat(this.drumsticks[Math.floor(Math.random() * this.drumsticks.length)]),
			);
	}
}

export { Drum };
export default Drum;
