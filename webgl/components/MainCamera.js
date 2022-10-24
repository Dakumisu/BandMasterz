import { PerspectiveCamera, Vector3 } from 'three';
import BaseCamera from '@cafe-noisette/philbin/webgl/components/BaseCamera';

export default class MainCamera extends BaseCamera {
	init() {
		this.camPos = this.base.position.fromArray([0, 0, 6]);
	}
}
