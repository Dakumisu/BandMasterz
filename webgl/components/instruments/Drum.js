import { BoxGeometry, Mesh, MeshBasicMaterial, MeshPhysicalMaterial } from 'three';
import BaseInstrument from './BaseInstrument';

class Drum extends BaseInstrument {
	init() {
		const geo = new BoxGeometry(1, 1, 1);
		const mat = new MeshPhysicalMaterial({ color: 0xffffff });
		const mesh = new Mesh(geo, mat);
		mesh.position.set(0, 0, -2);

		this.base = mesh;
	}

	devtools() {
		super.devtools();
		// const gui = this.gui.addFolder({ title: 'Drum', index: 1 });
	}
}

export { Drum };
export default Drum;
