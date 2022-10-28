import BaseCamera from '@cafe-noisette/philbin/webgl/components/BaseCamera';
import { Vector3 } from 'three';

export default class MainCamera extends BaseCamera {
	init() {
		this.camPos = this.base.position.fromArray([-1.5, 3, 6]);
		this.cam.lookAt(new Vector3(0, 1, 0));
	}
}
