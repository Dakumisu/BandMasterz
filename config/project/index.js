import { routes, getBasePath } from '../router';
import i18n from '../i18n';
import environnement from '../environnement';

export default {
	name: 'Halpert',

	i18n,

	router: {
		routes,
		getBasePath,
	},

	environnement,
};
