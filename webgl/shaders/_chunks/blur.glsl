vec4 blur(vec4 b, sampler2D height, vec2 uv, vec2 blurOffset) {
	b += texture2D(height, uv + vec2(-4.0, -4.0) * blurOffset) * .05;
	b += texture2D(height, uv + vec2(-3.0, -3.0) * blurOffset) * .09;
	b += texture2D(height, uv + vec2(-2.0, -2.0) * blurOffset) * .12;

	b += texture2D(height, uv + vec2(-1.0, -1.0) * blurOffset) * .15;
	b += texture2D(height, uv + vec2(0.0, 0.0) * blurOffset) * .16;
	b += texture2D(height, uv + vec2(1.0, 1.0) * blurOffset) * .15;

	b += texture2D(height, uv + vec2(2.0, 2.0) * blurOffset) * .12;
	b += texture2D(height, uv + vec2(3.0, 3.0) * blurOffset) * .09;
	b += texture2D(height, uv + vec2(4.0, 4.0) * blurOffset) * .05;

	return b;
}
