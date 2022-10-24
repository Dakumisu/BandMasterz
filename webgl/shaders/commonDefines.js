export default function getCommonDefines(webgl) {
	if (webgl.defines) return webgl.defines;

	const defines = {
		IS_MOBILE: webgl.$app.$device.type.mobile,
		PI: Math.PI,
		PI2: Math.PI * 2,
	};

	Object.assign(webgl, { defines });
}
