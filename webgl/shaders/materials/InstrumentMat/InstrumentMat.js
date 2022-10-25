import webgl from '@cafe-noisette/philbin/webgl';
import { Color, ShaderMaterial, DoubleSide } from 'three';

import fs from './InstrumentMat.frag?hotshader';
import vs from './InstrumentMat.vert?hotshader';

let instance = null;

class InstrumentMat extends ShaderMaterial {
	constructor(opts = {}) {
		super();

		this.uniforms = {
			uColor: { value: new Color(0xbecede) },
			uColorDark: { value: new Color(0x798999) },
			...webgl.uniforms,
			...opts.uniforms,
		};

		this.defines = {
			...webgl.defines,
		};

		this.side = DoubleSide;

		fs.use(this);
		vs.use(this);

		this.type = 'ShaderMaterial';
		this.isShaderMaterial = true;
	}
}

InstrumentMat.use = () => {
	instance = instance || new InstrumentMat();
	return instance;
};

export default InstrumentMat;
export { InstrumentMat };
