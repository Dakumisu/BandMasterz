import { defineConfig, splitVendorChunkPlugin } from 'vite';

/* PLUGINS */
import yaml from '@rollup/plugin-yaml';
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import sortMediaQueries from 'postcss-sort-media-queries';
import svgSpritePlugin from 'vite-plugin-svg-sprite-component';
import copyFiles from 'rollup-plugin-copy';
import hotShadersRollupPlugin from './plugins/hotShaders/hotshadersRollupPlugin';
import ifdefRollupPlugin from './plugins/ifdef/ifdefRollupPlugin';
import proxyLoggerPlugin from './plugins/proxyLogger/proxyLoggerPlugin';

/* PROJECT CONFIG */
import project from '../project';

/* UTILS */
import { getDeveloper } from './utils/getDeveloper';
import { logger } from './utils/logger';
import { paths, pathsAliases } from './utils/paths';
import { terminalHeader } from './utils/terminalHeader';
import { getTimestampHash } from './utils/timestamp';

/* DEFAULT BUILD OPTIONS */
const options = {
	dropConsole: true,
	minify: true,
	esbuildMinification: true,
};

/* DEFAULT HOST CONFIG */
const config = {
	https: true,
	port: 8085,
};

/* DEFAULT DEFINES */
const defines = {
	DEBUG: false,
	PROJECT_BASEPATH: JSON.stringify(process.env.PWD),
	VUE_LOG: false,
	VUE_LOG_LIFECYCLE: false,
	WEBGL_LOG: true,
	WEBGL_ASYNC: true,
	WEBGL_LOG_LIFECYCLE: false,
	SHOW_QUALITY_MONITOR: true,
};

/* DEFINES LOGGERS */
const ViteLogger = logger('✨', { namespace: 'cn.vite' });
const CNLogger = logger('📦', { namespace: 'cn.philbin' });
const ProjectLogger = logger('🏓', { namespace: 'cn.project' });

export default ({ mode: _mode }) => {
	/* Get environnement mode */
	const mode = _mode || 'production';
	process.env.NODE_ENV = mode; // Force NODE_ENV

	/* Get developper */
	const developper = getDeveloper();

	/* Access to the environnement's config */
	const envs = project.environnement({ developper });
	const env = envs[mode] || envs.production;

	Object.assign(options, { ...env.vite });
	Object.assign(defines, { ...env.defines });

	/* Set env defines */
	const isDevelopment = mode === 'development';
	const isPreprod = mode === 'preprod' || mode === 'preproduction';
	const isStaging = mode === 'staging';
	const isProduction = !isDevelopment && !isPreprod && !isStaging;

	const minify = !isDevelopment && options.minify;

	/* Get Project infos */
	const projectName = project.name;
	const projectVersion = process.env.npm_package_version || '0.0.1';
	const { timestamp, hash } = getTimestampHash(projectVersion);

	/* Global defines variables */
	const MANDATORY_DEFINES = {
		ENVIRONMENT: JSON.stringify(mode),
		DEVELOPMENT: JSON.stringify(isDevelopment),
		PRODUCTION: JSON.stringify(isProduction),
		STAGING: JSON.stringify(isStaging),
		DEVELOPPER: JSON.stringify(developper.username),
		...defines,
	};

	terminalHeader.set(projectName, projectVersion, developper.username, mode);

	return defineConfig({
		root: paths.root,
		logLevel: 'info',

		server: {
			port: config.port,
			https: config.https,
			open: false,
			host: true,
			hmr: { port: config.port },
			watch: { usePolling: true },
		},

		base: '/',
		publicDir: paths.public,
		cacheDir: paths.cache,

		define: MANDATORY_DEFINES,

		assetsInclude: /\.(bin|gtlf|glb|ktx|m4a|mp3|aac|obj|draco)$/,

		resolve: {
			alias: pathsAliases,
			extensions: ['.cjs', '.mjs', '.js', '.ts', '.jsx', '.tsx', '.vue'],
		},

		json: {
			stringify: true,
		},

		plugins: [
			vue(),
			ifdefRollupPlugin(MANDATORY_DEFINES),
			hotShadersRollupPlugin(isDevelopment),
			yaml(),
			svgSpritePlugin({ symbolId: (name) => 'icon-' + name, component: { type: 'vue' } }),
			splitVendorChunkPlugin(),
			proxyLoggerPlugin(),
		],

		css: {
			postcss: {
				plugins: [
					autoprefixer({ grid: true }),
					sortMediaQueries({ sort: 'mobile-first' }),

					// Fix "@charset" must be the first rule in the file warning
					{
						postcssPlugin: 'internal:charset-removal',
						AtRule: {
							charset: (atRule) => {
								if (atRule.name === 'charset') {
									atRule.remove();
								}
							},
						},
					},
				],
			},
			preprocessorOptions: {
				scss: {
					additionalData: `
						@use "@app/style/scss" as *;
					`,
					sassOptions: {
						outputStyle: 'compressed',
					},
				},
			},
		},

		build: {
			manifest: false,
			outDir: paths.dist,
			assetsInlineLimit: 0,
			sourcemap: false,
			chunkSizeWarningLimit: 800,
			emptyOutDir: false,
			target: 'modules',
			minify: minify ? (options.esbuildMinification ? 'esbuild' : 'terser') : false,
			terserOptions: options.esbuildMinification
				? undefined
				: {
						ecma: '2017',
						compress: {
							drop_console: !defines.DEBUG && options.dropConsole,
							dead_code: true,
							keep_infinity: true,
							passes: 1,
							toplevel: false,
						},
						format: {
							comments: false,
						},
				  },
			rollupOptions: {
				// input: paths.input,
				treeshake: {
					// moduleSideEffects: false,
					tryCatchDeoptimization: true,
					propertyReadSideEffects: true,
					unknownGlobalSideEffects: true,
				},
				output: {
					entryFileNames: isDevelopment
						? `${paths.assetsFolder}/[name].${hash}.js`
						: `${paths.assetsFolder}/[name].[hash]${hash}.js`,
					chunkFileNames: isDevelopment
						? `${paths.assetsFolder}/[name].${hash}.js`
						: `${paths.assetsFolder}/[name].[hash]${hash}.js`,
					assetFileNames: ({ name }) => {
						return name.endsWith('css')
							? isDevelopment
								? `${paths.assetsFolder}/[name].${hash}.[ext]`
								: `${paths.assetsFolder}/[name].[hash]${hash}.[ext]`
							: `${paths.assetsFolder}/[name].[hash]${hash}.[ext]`;
					},
				},
				plugins: [
					copyFiles({
						targets: [{ src: `${paths.root}/static`, dest: `${paths.dist}` }],
						verbose: false,
						copyOnce: true,
					}),
				],
			},
		},
	});
};
