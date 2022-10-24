import path from 'path';
import fs from 'fs';

const root = process.cwd();
const src = path.join(root, 'src');
const temp = path.join(root, '.cn');

const paths = {
	root,
	src,
	temp,

	cache: path.join(temp, 'vite'), // vite cache
	config: path.join(root, 'config'), // Config Entry
	dist: path.join(temp, 'dist'), // Build folder
	public: path.join(src, 'static'), // Static Folder
	input: path.join(src, 'main.js'), // Main entry point
	webgl: path.join(root, 'webgl.js'), // Main entry point
	html: path.join(root, 'index.html'), // Main html file

	assetsFolder: 'assets',
	staticFolder: 'static',
};

// get the path aliases from the jsconfig file
const pathsAliases = fs
	.readFileSync(path.join(root, 'jsconfig.json'), 'utf8')
	.match(/"paths":\s*{([^}]+)}/)[1]
	.split(',')
	.slice(0, -1)
	.map((path) => path.trim())
	.map((path) => path.split(':'))
	.map(([_alias, _path]) => {
		const a = _alias.replace(/"/g, '').replace('/*', '');

		// transform [\n        ./webgl/*\n      ] to ./webgl
		const p = _path
			.replace(/"/g, '')
			.replace('/*', '')
			.replace(/\\n/g, '')
			.replace(/ /g, '')
			.split('[\n')
			.pop()
			.split('\n]')
			.shift();

		return { find: a, replacement: path.join(root, p) };
	});

export { paths, pathsAliases };
