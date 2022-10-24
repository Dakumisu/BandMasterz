import { ShaderChunk } from 'three';

const chunks = import.meta.globEager('./*.glsl');

export default function addChunks() {
	for (const k in chunks) {
		const id = k.split('/').pop().slice(0, -'.glsl'.length);
		ShaderChunk[id] = chunks[k].default;
	}
}
