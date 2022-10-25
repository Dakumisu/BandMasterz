export default ({ developper }) => {
	const envs = {};

	envs.development = {
		defines: {
			DEBUG: true,
			PRELOADER_SKIP_ANIMATIONS: developper.is('Alex', 'g-bgjv2-04.intra.gobelins.fr'),
		},
	};

	envs.preprod = {
		vite: { minify: true },
		defines: { DEBUG: true },
	};

	envs.staging = {
		defines: { DEBUG: false, SHOW_QUALITY_MONITOR: false },
	};

	envs.production = {
		defines: { DEBUG: false, SHOW_QUALITY_MONITOR: false },
	};

	return envs;
};
