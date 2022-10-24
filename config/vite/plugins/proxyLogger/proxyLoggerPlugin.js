import { terminalHeader } from '../../utils/terminalHeader.js';
import { green, italic, magenta, nsLogger } from '../../utils/logger.js';

const logger = nsLogger('cn.vite');
const projectLogger = nsLogger('cn.project');

function middleware(msg) {
	msg = msg.trim();

	if (msg.toLowerCase().includes('dev server running')) {
		const version = msg.match(/v(\d+\.\d+.\d+)/im);
		msg = green('Dev server started!');
		terminalHeader.output();
		return logger.success(msg, { submsg: italic(version[0]) });
	}

	if (msg.toLowerCase().includes('building for')) {
		// const env = msg.toLowerCase().match(/building for ([a-z0-9]+)/im)[1];

		msg = magenta(`Building started`);
		terminalHeader.output();

		return logger.log(msg);

		// msg = blue('Environnement ' + env + '\n');
		// projectLogger.log(msg);
	}

	if (msg.toLowerCase().includes('> local:') || msg.toLowerCase().includes('> network:')) {
		const prefixe = msg.toLowerCase().includes('> local:') ? 'Local:' : 'Network:';
		let host = msg.toLowerCase().split(prefixe.toLowerCase())[1].trim();
		// remove default color codes
		host = host.replace(/\x1b\[[0-9;]*m/g, '');
		msg = `↪ ${prefixe}  `;
		msg += magenta(host);
		return logger.log(msg);
	}

	if (msg.toLowerCase().includes('ready')) {
		// remove default color codes
		msg = msg.replace(/\x1b\[[0-9;]*m/g, '');
		msg += '\n';
		msg = magenta(msg);
		return logger.log(msg);
	}

	msg = msg.replace(/> /g, '↪ ');
	msg = msg.replace(/✨/g, '🪄');

	if (msg.toLowerCase().includes('page reload')) {
		return logger.log(msg);
	}

	if (msg.toLowerCase().includes('watching for file changes')) {
		logger.log('', { noPrefix: true });
		return logger.log(
			logger.yellow('Preview mode: ') + logger.gray('watching for file changes'),
		);
	}

	if (msg.toLowerCase().includes('build started...')) {
		return logger.log(logger.gray('build started...'));
	}

	if (!msg.trim().length) return;
	return logger.log(msg);
}

const proxyLogger = {
	info: middleware,
	log: middleware,
	logOnce: console.log,
	warn: middleware,
	warnOnce: console.log,
	error: middleware,
	errorOnce: console.log,
	clearScreen: () => {},
};

function proxyLoggerPlugin() {
	return {
		name: 'vite-cn-logger',
		configResolved(c) {
			c.logger = proxyLogger;
		},
	};
}

export default proxyLoggerPlugin;
export { proxyLoggerPlugin, proxyLogger };
