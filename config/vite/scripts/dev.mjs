import 'zx/globals';
import minimist from 'minimist';

const FLAGS = minimist(process.argv.slice(2), {
	boolean: ['clear-cache'],
	string: ['env'],
	default: {
		'clear-cache': false,
		env: 'development',
	},
});

(async () => {
	process.env.FORCE_COLOR = 3; // Force colors in terminal

	FLAGS['clear-cache'] && (await $`rm -rf .cn/vite/`);
	await $`vite -m ${FLAGS.env} -c config/vite/vite.config.js`;
})();
