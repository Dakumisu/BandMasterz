import webgl from '@cafe-noisette/philbin/webgl';
import { AlphaFormat } from 'three';

import { Texture, RepeatWrapping, NearestFilter, RedFormat, LuminanceFormat } from 'three';

export default function createTexture(opts) {
	const isWebGL2 = webgl.threeRenderer.capabilities.isWebGL2;

	const tex = new Texture(opts.img);

	if (opts.flipY !== undefined) tex.flipY = opts.flipY;
	if (opts.mipmaps !== undefined) tex.generateMipmaps = !!opts.mipmaps;

	if (opts.red) opts.format = isWebGL2 ? RedFormat : LuminanceFormat;
	if (opts.alpha) opts.format = AlphaFormat;

	if (opts.nearest) tex.magFilter = tex.minFilter = NearestFilter;
	if (opts.magFilter) tex.magFilter = opts.magFilter;
	if (opts.minFilter) tex.minFilter = opts.minFilter;

	if (opts.encoding) tex.encoding = opts.encoding;
	if (opts.mapping) tex.mapping = opts.mapping;
	if (opts.premultiplyAlpha) tex.premultiplyAlpha = true;

	if (opts.repeat) {
		tex.wrapS = RepeatWrapping;
		tex.wrapT = RepeatWrapping;
	} else {
		if (opts.wrapS) tex.wrapS = opts.wrapS;
		if (opts.wrapT) tex.wrapT = opts.wrapT;
	}

	if (opts.format) tex.format = opts.format;
	if (opts.type) tex.type = opts.type;

	tex.needsUpdate = true;
	return tex;
}
