import BaseScene from '@cafe-noisette/philbin/webgl/components/BaseScene';
import { BoxGeometry, Color, Mesh, MeshBasicMaterial } from 'three';
import MainCamera from './MainCamera';

export default class Scene extends BaseScene {
	get mixins() {
		return ['debugCamera'];
	}

	init() {
		this.camera = this.add(MainCamera);

		this.cubeColor = new Color(0xfec238);
		this.cube = new Mesh(
			new BoxGeometry(2.5, 2.5, 2.5),
			new MeshBasicMaterial({ color: this.cubeColor }),
		);
		this.cube.position.z = -1;
		this.addObject3D(this.cube);
	}

	update() {
		this.cubeColor.offsetHSL(0.003, 0, 0);
		this.cube.material.color = this.cubeColor;
		this.cube.rotation.y -= 0.01;
		this.cube.rotation.x = Math.cos(this.webgl.$time.elapsed * 0.0003) * 0.9;
	}
}
