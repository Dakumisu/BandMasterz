import MeshoptDecoder from './MeshoptDecoder';
import { GLTFLoader } from './GLTFLoader';
import { cache } from '@cafe-noisette/philbin/utils/files/cache';

const gltfLoader = new GLTFLoader();
gltfLoader.setMeshoptDecoder(MeshoptDecoder);

export async function loadGLTF(url, opts = {}) {
	return new Promise((resolve, reject) => {
		gltfLoader.load(
			url,
			(data) => {
				cache.add(url, data);
				if (opts.onLoad) opts.onLoad(data);
				resolve(data);
			},
			() => {},
			reject,
		);
	});
}

loadGLTF.loader = {
	name: 'gltf',
	extensions: ['.gltf', '.glb'],
	function: loadGLTF,
};
