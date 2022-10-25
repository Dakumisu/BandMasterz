import files from '@cafe-noisette/philbin/utils/files';
import imageSupport from '@cafe-noisette/philbin/utils/files/imageSupport';
import { listMedias } from '@cafe-noisette/philbin/utils/files/listMedias';

import { loadImage } from '@cafe-noisette/philbin/utils/files/loaders/loadImage';
import { loadGLTF } from './loaders/loadGLTF';

import wrapModel from '@webgl/utils/wrapModel';

listMedias.registerExt(['gltf', 'glb'], { type: 'model' });
const MODELS = listMedias(import.meta.globEager('/assets/models/*.{gltf,glb}'), {
	forceArray: true,
});

const img = imageSupport.select;

export default function resourcesPlugin(webgl, opts = {}) {
	const { logger, name } = opts;

	webgl.atlas = {};
	webgl.textures = {};
	webgl.geometries = {};
	webgl.images = {};
	webgl.models = {};
	webgl[name] = {
		preload,
		atlas: webgl.atlas,
		textures: webgl.textures,
		geometries: webgl.geometries,
		models: webgl.models,
		images: webgl.images,
	};

	async function preload() {
		if (DEBUG) console.time('Webgl preload');

		await imageSupport.test();

		files.registerLoader(loadImage);
		files.registerLoader(loadGLTF);

		const p = [];

		p.push(
			...MODELS.map((model) => {
				return loadGLTF(model.url, {
					onLoad: (data) => {
						const obj = data.scene;
						wrapModel(obj);
						webgl.models[model.name] = obj;
					},
				});
			}),
		);

		// Link loads to preloader tasks
		p.forEach((v) => webgl.$app.$preloader.task(v));
		await Promise.all(p);

		// if (DEBUG) console.timeEnd('Webgl preload');
	}
}
