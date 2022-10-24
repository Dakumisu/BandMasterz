import 'zx/globals';
import prompts from 'prompts';

(async () => {
	process.env.FORCE_COLOR = 3; // Force colors in terminal

	const t = await $`npm run build`;

	await $`#!/bin/bash`;
	const projectName = (await $`git remote get-url origin`).stdout
		.split('/')
		.pop()
		.replace('.git', '')
		.toLowerCase()
		.trim();

	const branch = (await $`git branch --show-current`).stdout.trim();
	const env = t.stderr.split('-m')[1].split('-c')[0].trim();
	const developper = process.env.USER || 'null';

	const prefixs = {
		branch,
		env,
		developper,
	};

	const inProduction = env === 'production';

	let prefix;
	if (!inProduction) {
		const response = await prompts([
			{
				type: 'select',
				name: 'type',
				message: 'URL Prefixe',
				choices: [
					{
						title: 'Developper Name',
						value: 'developper',
						description: `https://${developper}--${projectName}.netlify.app`,
					},
					{
						title: 'Environnement',
						value: 'env',
						description: `https://${env}--${projectName}.netlify.app`,
					},
					{
						title: 'Branch',
						value: 'branch',
						description: `https://${branch}--${projectName}.netlify.app`,
					},
				],
				hint: '- Space to select. Return to submit',
			},
		]);
		prefix = response.type;
		if (!prefix) return;
	}

	const message = `🚀 ${developper} deployed ${branch} in ${env}`;
	const url = `https://${prefix ? prefixs[prefix] + '--' : ''}${projectName}.netlify.app`;

	if (inProduction) await $`netlify deploy --prod --message ${message}`;
	else await $`netlify deploy --alias ${prefixs[prefix]} --message ${message}`;

	// process.stdout.write(`Branch : ${branch} \n`);
	// process.stdout.write(`Environnement : ${env} \n`);
	// process.stdout.write(`---------------------------\n`);
	// process.stdout.write(`\x1b[93m\x1b[1m🔥 Deployment finished !\x1b[22m\x1b[39m\n\n`);
	// process.stdout.write(`\x1b[93m\x1b[1m🔥 ${url}\x1b[22m\x1b[39m\n\n`);
})();
