import BaseComponent from '@cafe-noisette/philbin/webgl/components/BaseComponent';
import { Group } from 'three';

export default class Room extends BaseComponent {
	init() {
		this.base = new Group();
	}
}
