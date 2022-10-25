import { objectToArray } from '@cafe-noisette/philbin/utils/misc/objectToArray';

/**
 * List medias from a vite import glob object
 *
 * Example:
 * const icons = listMedias(import.meta.globEager('/src/assets/icons/*'));
 *
 */

const IMAGES_EXTENSIONS = ['jpeg', 'png', 'jpg', 'gif', 'avif', 'webp'];
const VIDEOS_EXTENSIONS = ['mp4', 'webm', 'ogg'];
const OTHERS_EXTENSIONS = [];
const MEDIAS_EXTENSIONS = [...IMAGES_EXTENSIONS, ...VIDEOS_EXTENSIONS];

const TYPES = {
	images: IMAGES_EXTENSIONS,
	videos: VIDEOS_EXTENSIONS,
	other: OTHERS_EXTENSIONS,
};

function listMedias(res, { forceList = false, forceArray = false } = {}) {
	let medias = {};

	const EXTENSIONS = [...MEDIAS_EXTENSIONS, ...OTHERS_EXTENSIONS];

	for (let filepath in res) {
		const pkg = res[filepath];
		const url = pkg.default;
		const filename = filepath.split('/').pop().split('.');
		let ext = filename.pop();
		if (!EXTENSIONS.includes(ext)) continue;
		if (EXTENSIONS.includes(ext)) ext = 'url';
		const name = filename.join('.');
		const obj = (medias[name] = medias[name] || {});
		obj[ext] = url;
	}

	if (Object.values(medias).length === 1 && !forceList) medias = Object.values(medias)[0];
	if (forceArray) medias = objectToArray(medias);

	return medias;
}

listMedias.registerExt = (ext, type) => {
	const types = type ? TYPES[type] : OTHERS_EXTENSIONS;
	const exts = Array.isArray(ext) ? ext : [ext];
	exts.map((ext) => {
		if (types.includes(ext))
			throw new Error(`Extension ${ext} already registered in type ${type}`);
		types.push(ext);
	});
};

export { listMedias };
export default listMedias;
