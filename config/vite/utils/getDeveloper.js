import os from 'os';

function getDeveloper() {
	let username = os.hostname() || 'michel';
	if (username.endsWith('.local')) username = username.slice(0, -6);

	const is = (...names) => {
		const last = names[names.length - 1];
		const strict = typeof last === 'boolean' && last;
		if (typeof last === 'boolean') names.pop();

		for (let name of names) {
			if (strict && username.toUpperCase() === name.toUpperCase()) return true;
			else if (!strict && username.startsWith(name)) return true;
		}

		return false;
	};

	const api = {
		get username() {
			return username;
		},
		is,
	};

	return api;
}

export default getDeveloper;
export { getDeveloper };
