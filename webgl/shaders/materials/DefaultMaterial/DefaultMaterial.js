import webgl from '@cafe-noisette/philbin/webgl';
import { Color, ShaderMaterial, UniformsLib, UniformsUtils } from 'three';

import fs from './DefaultMaterial.frag?hotshader';
import vs from './DefaultMaterial.vert?hotshader';

let instance = null;

class DefaultMaterial extends ShaderMaterial {
	constructor() {
		super();

		const u = (this.uniforms = {
			...UniformsUtils.merge([
				UniformsLib.common,
				UniformsLib.specularmap,
				UniformsLib.lights,
			]),

			diffuse: { value: new Color(0xffffff) },
			emissive: { value: new Color(0xffffff) },
			specular: { value: new Color(0x333355) },
			shininess: { value: 30 },
			color: { value: new Color(0xfec238) },

			...webgl.uniforms,
		});

		this.defines = {
			...webgl.defines,
		};

		fs.use(this);
		vs.use(this);

		this.map = u.map.value;
		this.lights = true;
		this.fog = false;

		this.type = 'ShaderMaterial';
		this.isShaderMaterial = true;
	}
}

DefaultMaterial.use = () => {
	instance = instance || new DefaultMaterial();
	return instance;
};

export default DefaultMaterial;
export { DefaultMaterial };
