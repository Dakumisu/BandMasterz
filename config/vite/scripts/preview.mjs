import 'zx/globals';
import minimist from 'minimist';

const FLAGS = minimist(process.argv.slice(2), {
	boolean: ['no-build'],
	default: {
		'no-build': false,
	},
});

(async () => {
	process.env.FORCE_COLOR = 3; // Force colors in terminal

	if (!FLAGS['no-build']) {
		await $`npm run build`;
		console.log();
	}
	await $`vite preview --port 3000 -c config/vite/vite.config.js`;
})();
