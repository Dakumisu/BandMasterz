import { dim, gray, green, italic, magenta, nsLogger } from './logger';

const CNLogger = nsLogger('cn.philbin');
const ProjectLogger = nsLogger('cn.project');

let philbinVersion, projectName, projectVersion, developper, mode;

const terminalHeader = {
	set: (_projectName, _projectVersion, _developper, _mode) => {
		philbinVersion = require('@cafe-noisette/philbin/package.json').version;
		projectName = _projectName;
		projectVersion = _projectVersion;
		developper = _developper;
		mode = _mode;
	},

	output: () => {
		console.log();
		CNLogger.log(gray(dim('Philbin ') + italic('v' + philbinVersion) + `\n`));

		ProjectLogger.log('Project: ' + magenta(projectName), {
			submsg: italic('v' + projectVersion),
		});
		ProjectLogger.log('Developer: ' + magenta(developper));
		ProjectLogger.log('Environnement: ' + magenta(mode));
		console.log();
	},
};

export default terminalHeader;
export { terminalHeader };
