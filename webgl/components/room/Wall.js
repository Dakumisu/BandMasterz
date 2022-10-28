import BaseComponent from '@cafe-noisette/philbin/webgl/components/BaseComponent';
import { InstrumentMat } from '@webgl/shaders/materials';
import { Mesh, PlaneGeometry } from 'three';

export default class Wall extends BaseComponent {
	init() {
		const geo = new PlaneGeometry(1, 1, 1, 1);
		const mat = InstrumentMat.use();
		const mesh = new Mesh(geo, mat);

		mesh.position.set(0, 24, -10);
		mesh.rotation.set(0, Math.PI, 0);
		mesh.scale.set(300, 50, 1);

		Object.assign(this, {
			geo,
			mat,
			mesh,
			base: mesh,
		});
	}
}
