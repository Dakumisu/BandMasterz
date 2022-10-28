import BaseComponent from '@cafe-noisette/philbin/webgl/components/BaseComponent';
import { InstrumentMat } from '@webgl/shaders/materials';
import { Mesh, PlaneGeometry } from 'three';

export default class Floor extends BaseComponent {
	init() {
		const geo = new PlaneGeometry(1, 1, 1, 1);
		const mat = InstrumentMat.use();
		const mesh = new Mesh(geo, mat);

		mesh.position.set(0, -0.1, 0);
		mesh.rotation.x = -Math.PI / 2;
		mesh.scale.set(300, 100, 1);

		Object.assign(this, {
			geo,
			mat,
			mesh,
			base: mesh,
		});
	}
}
