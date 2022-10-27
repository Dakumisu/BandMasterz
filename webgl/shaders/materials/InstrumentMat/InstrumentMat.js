import webgl from '@cafe-noisette/philbin/webgl';
import { Color, ShaderMaterial, DoubleSide } from 'three';

import fs from './InstrumentMat.frag?hotshader';
import vs from './InstrumentMat.vert?hotshader';

let instance = null;

class InstrumentMat extends ShaderMaterial {
	constructor() {
		super();

		this.uniforms = {
			uColor: { value: new Color(0xaabbdd) },
			uColorDark: { value: new Color(0x798999).offsetHSL(0, 0, 0.2) },

			...webgl.uniforms,
			...webgl.uniforms.textures,
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
