import { throttle, wait } from '@cafe-noisette/philbin/utils/async';
import { easings, getEase } from '@cafe-noisette/philbin/utils/easing';
import { dampPrecise, prng } from '@cafe-noisette/philbin/utils/maths';
import { raf } from '@cafe-noisette/philbin/utils/raf';
import FBOMixin from '@webgl/mixins/FBOMixin';
import { DrumMat, DrumTopMat } from '@webgl/shaders/materials';
import { easeOutBounce } from '@webgl/utils/easings';
import { Group, Vector2 } from 'three';
import BaseInstrument from './BaseInstrument';

import FBOFragment from '@webgl/shaders/materials/Drum/DrumTopMat/FBOFragment.frag?hotshader';

const KEYS_WHITELIST = [
	['KeyC', 'E5', 0],
	['KeyV', 'F5', 1],
].reduce((p, v) => ((p[v[0]] = [v[1], v[2]]), p), {});

console.log(KEYS_WHITELIST);

class Drum extends BaseInstrument {
	get mixins() {
		return [FBOMixin, ...super.mixins];
	}

	beforeInit() {
		this.FBOFragment = FBOFragment;
		this.FBOSize = 1024;
	}

	init() {
		const model = this.webgl.models.drum;
		const mat = DrumMat.use();

		const group = new Group();

		const drum = (group.drum = model.get('drum'));
		const drumTop = model.get('top');
		drum.traverse((child) => {
			if (child.material) child.material = mat;
		});
		drumTop.material = DrumTopMat.use();

		const drumsticks = (group.drumsticks = model.get('drumstick', true));
		drumsticks.map((drumstick, i) => {
			drumstick.material = mat;

			Object.assign(drumstick, { ...this.animeDrumstick(drumstick, i) });
			// const t = this.animeDrumstick(drumstick, i);
			// drumstick.update = t.update;
			// drumstick.hit = t.press;
			// drumstick.release = t.release;
			// drumstick.release = t.release;
		});
		console.log(drumsticks);

		group.add(...[drum, ...drumsticks]);
		group.scale.setScalar(0.5);

		this.audio = this.webgl.$app.$audio.tone.drum;
		this.hitWatcher = this.audio.hit.watch(this.press.bind(this));
		this.releaseWatcher = this.audio.release.watch(this.release.bind(this));

		this.webgl.$app.$controls.keyboard.watchKeys(Object.keys(KEYS_WHITELIST), (key, value) => {
			const index = KEYS_WHITELIST[key][1];
			const note = KEYS_WHITELIST[key][0];
			value ? this.press(note, index) : this.release(note, index);
		});

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

		// this.animeDrumstick = throttle(this.animeDrumstick.bind(this), 100, { leading: true });
	}

	afterInit() {
		Object.assign(this.fbo.heightFilter.uniforms, {
			kickSide: { value: [0, 0] },
			FBOSize: { value: new Vector2().set(this.FBOSize, this.FBOSize) },
		});
	}

	animeDrumstick(drumstick, index) {
		const releaseEase = getEase(easings.inSine);
		const pressEase = easeOutBounce;
		const pressSmoothing = 0.1;
		const releaseSmoothing = 0.15;
		let morphtarget = drumstick.morphTargetInfluences[0];
		let ease = pressEase;

		const states = {
			ease: pressEase,
			morphtarget,
			current: morphtarget,
			target: morphtarget,
			smoothing: pressSmoothing,
		};

		const press = async () => {
			states.current = drumstick.morphTargetInfluences[0];
			states.target = 1;
			states.smoothing = pressSmoothing;
			states.ease = pressEase;
			this.currentDrumstick = index;
			this.fbo.heightFilter.uniforms.kickSide.value[index] = 1;
		};

		const release = () => {
			states.current = drumstick.morphTargetInfluences[0];
			states.target = 0;
			states.smoothing = releaseSmoothing;
			states.ease = releaseEase;
			this.fbo.heightFilter.uniforms.kickSide.value[index] = 0;
		};

		const update = () => {
			if (states.current === states.target) return;

			const { target, smoothing, ease } = states;
			const dt = this.webgl.$time.dt;

			states.current = dampPrecise(states.current, target, smoothing, dt, 0.01);
			states.morphtarget = drumstick.morphTargetInfluences[0] = ease(states.current);
		};

		return { press, hit: press, release, update, states };
	}

	beat() {
		const index = this.currentDrumstick === 0 ? 1 : 0;
		this.drumsticks[index].hit();
		this.audio.randomSnare();
	}

	press(note, index) {
		index = !isNaN(index) ? index : this.currentDrumstick === 0 ? 1 : 0;
		note = note || this.getNoteByIndex(index);
		this.drumsticks[index].hit();
		note ? this.audio.snare.hit({ note }) : this.audio.randomSnare();
	}

	release(note, index) {
		index = !isNaN(index) ? index : this.currentDrumstick;
		note = note || this.getNoteByIndex(index);
		this.drumsticks[index].release();
		if (note) this.audio.snare.release({ note });
	}

	getNoteByIndex(index) {
		return KEYS_WHITELIST[Object.keys(KEYS_WHITELIST)[index]][0];
	}

	updateTexture(tex) {
		this.drumTop.material.uniforms.uFBO.value = tex;
	}

	resize() {
		const { size } = this.webgl.$viewport;
		this.fbo.resize(1024, 1024);
		// this.fbo.resize(size.value.x, size.value.y);
	}

	update() {
		this.drumsticks.map((drumstick) => drumstick.update());

		this.drumTop.material.uniforms.kickAlpha.value = dampPrecise(
			this.drumTop.material.uniforms.kickAlpha.value,
			Math.max(this.drumsticks[0].states.morphtarget, this.drumsticks[1].states.morphtarget),
			0.3,
			this.webgl.$time.dt,
		);

		this.fbo.render();
	}

	beforeDestroy() {
		this.hitWatcher();
		this.releaseWatcher();
	}

	devtools() {
		this.gui = this.webgl.$app.$gui.addFolder({ title: 'Drum', index: 1 });
		super.devtools();

		this.gui.addButton({ title: 'Beat' }).on('click', () => this.beat());
	}
}

export { Drum };
export default Drum;
