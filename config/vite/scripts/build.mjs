import 'zx/globals';
import prompts from 'prompts';

(async () => {
	process.env.FORCE_COLOR = 3; // Force colors in terminal

	const response = await prompts([
		{
			type: 'select',
			name: 'type',
			message: 'Environnement de build',
			choices: [
				{ title: '🪄 Preproduction', value: 'preprod' },
				{ title: '💫 Staging', value: 'staging' },
				{ title: '✨ Production', value: 'production' },
			],
			hint: '- Space to select. Return to submit',
		},
	]);

	const env = response.type;
	if (!env) return;

	await $`rm -rf .cn/dist/ && vite build -m ${env} -c config/vite/vite.config.js`;

	// process.stdout.write(`\n`);
	// process.stdout.write(`Environnement : ${env} \n`);
	// process.stdout.write(`---------------------------\n`);
	// process.stdout.write(`\x1b[93m\x1b[1m🔥 Build finished !\x1b[22m\x1b[39m\n\n`);
})();
