import webgl from '@cafe-noisette/philbin/webgl';
import { Color } from 'three';
import DrumMat from '../DrumMat/DrumMat';

import fs from './DrumTopMat.frag?hotshader';
import vs from './DrumTopMat.vert?hotshader';

let instance = null;

class DrumTopMat extends DrumMat {
	constructor() {
		super();

		Object.assign(this.uniforms, {
			kickAlpha: { value: 1 },
			kickSide: { value: [0, 0] },
			uFBO: { type: 't', value: null },
		});

		fs.use(this);
		vs.use(this);
	}
}

DrumTopMat.use = () => {
	instance = instance || new DrumTopMat();
	return instance;
};

export default DrumTopMat;
export { DrumTopMat };
