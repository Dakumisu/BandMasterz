import colors from 'picocolors';

const {
	bold,
	dim,
	italic,
	underline,
	inverse,
	hidden,
	strikethrough,
	black,
	red,
	green,
	yellow,
	blue,
	magenta,
	cyan,
	white,
	gray,
	bgBlack,
	bgRed,
	bgGreen,
	bgYellow,
	bgBlue,
	bgMagenta,
	bgCyan,
	bgWhite,
} = colors;

export {
	bold,
	dim,
	italic,
	underline,
	inverse,
	hidden,
	strikethrough,
	black,
	red,
	green,
	yellow,
	blue,
	magenta,
	cyan,
	white,
	gray,
	bgBlack,
	bgRed,
	bgGreen,
	bgYellow,
	bgBlue,
	bgMagenta,
	bgCyan,
	bgWhite,
};

const loggers = {};
let maxPrefix = 0;

const LOG_LEVELS = {
	none: 1,
	mute: 1,
	success: 2,
	error: 2,
	warn: 3,
	log: 4,
	debug: 5,
	info: 5,
	all: 100,
};

function nsLogger(ns) {
	return {
		log: (...args) => loggers[ns].log(...args),
		warn: (...args) => loggers[ns].warn(...args),
		info: (...args) => loggers[ns].info(...args),
		error: (...args) => loggers[ns].error(...args),
		exit: (...args) => loggers[ns].exit(...args),
		success: (...args) => loggers[ns].success(...args),
		...colors,
	};
}

/**
 * @typedef {object} ProjectLogger
 * @property {object} colors
 * @property {function} info
 * @property {function} log
 * @property {function} warn
 * @property {function} error
 * @property {function} exit
 * @property {function} success
 */
export const ProjectLogger = {};

/**
 * Create a logger
 * @return {ProjectLogger}
 */
export function logger(prefix = '', { logLevel, color, namespace, usePad = false } = {}) {
	if (namespace && loggers[namespace]) return loggers[namespace];

	prefix = prefix + '';
	if (maxPrefix < prefix.length) {
		maxPrefix = prefix.length;
	}

	if (typeof logLevel !== 'function') {
		const _logLevel = logLevel || 'info';
		logLevel = () => _logLevel;
	}

	const getLogLevel = () => LOG_LEVELS[logLevel()] || LOG_LEVELS.info;

	const limiter = colors.dim(colors.gray(' · '));
	const precolor = color || 'gray';

	const ProjectLogger = { colors, log, warn, info, error, exit, success, ...colors };
	const api = ProjectLogger;

	if (namespace) loggers[namespace] = api;
	return api;

	function getPrefix(opts = {}) {
		if (opts.noPrefix) return '';
		const pad = typeof opts.usePad === undefined ? usePad : !!opts.usePad;
		const v = pad ? prefix.padStart(maxPrefix, ' ') : prefix;
		return v + limiter;
	}

	function info(msg, opts = {}) {
		const content = opts.raw
			? msg
			: colors.dim(colors.gray(getPrefix(opts))) +
			  colors.gray(msg) +
			  ' ' +
			  colors.dim(colors.gray(opts.submsg || ''));

		if (opts.return) return content;
		else if (getLogLevel() >= LOG_LEVELS.info) console.info(content);
	}

	function log(msg, opts = {}) {
		const content = opts.raw
			? msg
			: colors.dim(colors[precolor](getPrefix(opts))) +
			  msg +
			  ' ' +
			  colors.dim(colors.gray(opts.submsg || ''));

		if (opts.return) return content;
		else if (getLogLevel() >= LOG_LEVELS.log) console.log(content);
	}

	function warn(msg, opts = {}) {
		const content = opts.raw
			? msg
			: colors.yellow(getPrefix(opts)) +
			  colors.yellow('! ') +
			  msg +
			  ' ' +
			  colors.dim(colors.gray(opts.submsg || ''));

		if (opts.return) return content;
		else if (getLogLevel() >= LOG_LEVELS.warn) console.warn(content);
	}

	function success(msg, opts = {}) {
		const content = opts.raw
			? msg
			: colors.green(getPrefix(opts)) +
			  colors.green('✓ ') +
			  msg +
			  ' ' +
			  colors.dim(colors.gray(opts.submsg || ''));

		if (opts.return) return content;
		else console.log(content);
	}

	function error(msg, opts = {}) {
		const content = opts.raw
			? msg
			: colors.red(getPrefix(opts)) +
			  colors.red('⚠️ ') +
			  msg +
			  ' ' +
			  colors.dim(colors.gray(opts.submsg || ''));

		if (opts.return) return content;
		else if (getLogLevel() >= LOG_LEVELS.error) console.error(content);
	}

	function exit(msg, opts = {}) {
		const code = opts.code == null ? 1 : opts.code;
		if (code > 0) error(msg, opts);
		else log(msg, opts);
		process.exit(code);
	}
}

function info(msg) {
	console.log(colors.gray(msg));
}

function log(msg) {
	console.log(msg);
}

function warn(msg) {
	console.warn('⚠️  ' + colors.yellow(msg));
}

function error(msg) {
	console.error(colors.red(msg));
}

function exit(msg, opts = {}) {
	const code = opts.code == null ? 1 : opts.code;
	if (code > 0) error(msg);
	else log(msg);
	process.exit(code);
}

function success(msg) {
	console.log(colors.green(msg));
}

function clearCache() {
	for (let k in loggers) delete loggers[k];
}

export { info, log, warn, error, exit, success, nsLogger, clearCache };
export default { ...colors, info, log, warn, error, exit, success, logger, nsLogger, clearCache };
