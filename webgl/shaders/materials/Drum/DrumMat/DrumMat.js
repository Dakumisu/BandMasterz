import InstrumentMat from '../../InstrumentMat/InstrumentMat';

import fs from './DrumMat.frag?hotshader';
import vs from './DrumMat.vert?hotshader';

let instance = null;

class DrumMat extends InstrumentMat {
	constructor() {
		super();

		fs.use(this);
		vs.use(this);
	}
}

DrumMat.use = () => {
	instance = instance || new DrumMat();
	return instance;
};

export default DrumMat;
export { DrumMat };
