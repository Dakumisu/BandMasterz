import { hash as h } from './hash';

function getTimestampHash(projectVersion) {
	const now = new Date();
	const day = now.getDate().toString().padStart(2, '0');
	const month = (now.getMonth() + 1).toString().padStart(2, '0');
	const year = now.getFullYear().toString();
	const hour = now.getHours().toString().padStart(2, '0');
	const min = now.getMinutes().toString().padStart(2, '0');
	const sec = now.getSeconds().toString().padStart(2, '0');
	const timestamp = year + month + day + '-' + hour + min + sec;
	const version = projectVersion || '0.0.1';
	const hash = h(version + '_' + timestamp);

	return { timestamp, hash };
}

export { getTimestampHash };
export default getTimestampHash;
