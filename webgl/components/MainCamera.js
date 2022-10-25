import { PerspectiveCamera, Vector3 } from 'three';
import BaseCamera from '@cafe-noisette/philbin/webgl/components/BaseCamera';

export default class MainCamera extends BaseCamera {
	init() {
		this.camPos = this.base.position.fromArray([0, 10, 6]);
		this.cam.lookAt(new Vector3(0, 0, 0));
	}
}
