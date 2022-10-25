import DrumMat from '../DrumMat/DrumMat';

import fs from './DrumTopMat.frag?hotshader';
import vs from './DrumTopMat.vert?hotshader';

let instance = null;

class DrumTopMat extends DrumMat {
	constructor() {
		super();

		Object.assign(this.uniforms, {
			kickAlpha: { value: 0 },
			kickSide: { value: [0, 0] },
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
