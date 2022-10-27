import { prng } from '@cafe-noisette/philbin/utils/maths';
import BaseComponent from '@cafe-noisette/philbin/webgl/components/BaseComponent';
import FBOMixin from '@webgl/mixins/FBOMixin';
import {
	RGBAFormat,
	Vector3,
	BoxGeometry,
	DataTexture,
	FloatType,
	LuminanceFormat,
	RedFormat,
} from 'three';

import FBOFragment from './FBOFragment.frag?hotshader';

const BLUEPRINT = new BoxGeometry();

function inSphere(buffer, { radius, center }, fourElements = false) {
	for (let i = 0; i < buffer.length; i += fourElements ? 4 : 3) {
		const u = Math.pow(Math.random(), 1 / 3);

		let x = Math.random() * 2 - 1;
		let y = Math.random() * 2 - 1;
		let z = Math.random() * 2 - 1;

		const mag = Math.sqrt(x * x + y * y + z * z);

		x = (u * x) / mag;
		y = (u * y) / mag;
		z = (u * z) / mag;

		buffer[i] = x * radius + center[0];
		buffer[i + 1] = y * radius + center[1];
		buffer[i + 2] = z * radius + center[2];
	}

	return buffer;
}

export default class Particles extends BaseComponent {
	get mixins() {
		return [FBOMixin];
	}

	beforeInit() {
		this.FBOFragment = FBOFragment;
		this.FBOSize = 256;
	}

	init() {
		this.blueprint = BLUEPRINT;
		const isWebGL2 = this.webgl.threeRenderer.capabilities.isWebGL2;

		const size = this.FBOSize ** 2;
		const data = new Float32Array(size * 4);

		inSphere(data, { radius: 2, center: new Vector3().toArray() }, true);

		// for (let i = 0; i < size; i++) {
		// 	data[i * 4 + 0] = prng.randomFloat(0, 1);
		// 	data[i * 4 + 1] = prng.randomFloat(0, 1);
		// 	data[i * 4 + 2] = prng.randomFloat(0, 1);
		// 	data[i * 4 + 3] = 1 - prng.randomFloat(0, 1);
		// }

		const width = this.FBOSize;
		const height = this.FBOSize;
		const format = RGBAFormat;
		const type = FloatType;

		const dataTexture = new DataTexture(data, width, height, format, type);
		dataTexture.needsUpdate = true;

		this.log('dataTexture', dataTexture);

		Object.assign(this, {
			dataTexture,
		});
	}

	afterInit() {
		this.fbo.heightFilter.uniforms.uFBO.value = this.dataTexture;

		Object.assign(this.fbo.heightFilter.uniforms, {
			uVelocityFBO: { value: null },
			uSpeed: { value: prng.randomFloat(1, 10) },
		});
	}

	updateTexture(tex) {
		this.fbo.heightFilter.uniforms.uVelocityFBO.value = tex;
	}

	update() {
		this.fbo.render();
	}
}
