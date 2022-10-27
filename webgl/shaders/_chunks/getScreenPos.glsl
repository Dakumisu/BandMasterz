vec2 getScreenPos(vec2 pos, vec2 screenSize) {
	vec2 p = pos;
	p *= screenSize.xy;
	p /= screenSize.y;
	return p;
}
