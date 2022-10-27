vec2 generateNoiseUV(sampler2D noiseTex, vec2 uv, float time) {
	float na = texture2D(noiseTex, uv * .2 + time * .027).r;
	float nb = texture2D(noiseTex, uv * .35 + (time * .003) + na * .3).r - .1;
	float n = clamp(nb * 1.1, .1, .9);
	vec2 noiseUv = vec2(n) * uv + .2;

	return noiseUv;
}
