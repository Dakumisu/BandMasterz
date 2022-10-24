import BaseScene from '@cafe-noisette/philbin/webgl/components/BaseScene';
import { AmbientLight, DirectionalLight } from 'three';
import Drum from './instruments/Drum';
// import { DefaultMaterial } from '@webgl/shaders/materials';
import MainCamera from './MainCamera';

export default class Scene extends BaseScene {
	get mixins() {
		return ['debugCamera'];
	}

	init() {
		this.camera = this.add(MainCamera);
		this.drum = this.add(Drum);

		const light = new DirectionalLight({ color: 0xffffff, intensity: 1 });
		light.position.set(2, 2, 3);
		this.addObject3D(light);

		// const t = DefaultMaterial.use();
		// this.log(t);
	}

	update() {}
}
