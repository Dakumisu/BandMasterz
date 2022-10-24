import 'zx/globals';

(async () => {
	process.env.FORCE_COLOR = 3; // Force colors in terminal

	const t = await $`npm run build`;
	console.log();
	await $`vite preview --port 3000 -c config/vite/vite.config.js`;
})();
