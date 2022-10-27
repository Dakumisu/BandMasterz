import files from '@cafe-noisette/philbin/utils/files';
import imageSupport from '@cafe-noisette/philbin/utils/files/imageSupport';
import { listMedias } from '@cafe-noisette/philbin/utils/files/listMedias';

import { loadImage } from '@cafe-noisette/philbin/utils/files/loaders/loadImage';
import { loadGLTF } from './loaders/loadGLTF';

import wrapModel from '@webgl/utils/wrapModel';
import createTexture from '@webgl/utils/createTexture';
import loadTexture from './loaders/loadTexture';

listMedias.registerExt(['gltf', 'glb'], { type: 'model' });
const MODELS = listMedias(import.meta.globEager('/assets/models/*.{gltf,glb}'), {
	forceArray: true,
});

const noiseVoronoi = listMedias(import.meta.globEager('/assets/canvas/noise_voronoi.*'));
const noiseFbm = listMedias(import.meta.globEager('/assets/canvas/noise_fbm.*'));
const noisePerlin = listMedias(import.meta.globEager('/assets/canvas/noise_perlin.*'));
const noiseCurl = listMedias(import.meta.globEager('/assets/canvas/noise_curl.*'));

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

		// prettier-ignore
		p.push(...[
			[ img(noiseVoronoi), 'noiseVoronoi', { repeat: true } ],
			[ img(noiseFbm), 'noiseFbm', { repeat: true } ],
			[ img(noisePerlin), 'noisePerlin', { repeat: true } ],
			[ img(noiseCurl), 'noiseCurl', { repeat: true } ],
		].map(t => files.load(t[ 0 ], { onLoad: loadTexture(webgl, t) })));

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

		console.log(webgl.textures);

		// if (DEBUG) console.timeEnd('Webgl preload');
	}
}
