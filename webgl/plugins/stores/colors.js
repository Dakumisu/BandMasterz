import { Color } from 'three';

const colors = {};

const list = [
	['FlickrPink', '#f72585'],
	['Byzantine', '#b5179e'],
	['PurpleHeart', '#7209b7'],
	['Purple', '#560bad'],
	['TrypanBlue', '#480ca8'],
	['PurpleMountainsMajesty', '#3a0ca3'],
	['BlueBell', '#3f37c9'],
	['Blue', '#4361ee'],
	['Cyan', '#4895ef'],
	['Turquoise', '#4cc9f0'],
].reduce((p, v) => ((p[v[0]] = new Color().setStyle(v[1])), p), {});

Object.assign(colors, { list });

export { colors };
export default colors;
