const routes = [
	{
		path: '/',
		name: 'Home',
		component: () => import('@app/views/home/Home.vue'),
		meta: {},
	},
	{
		path: '/about',
		name: 'About',
		component: () => import('@app/views/about/About.vue'),
		meta: {},
	},
];

function getBasePath() {
	const { i18n } = window.__DATA;
	const id = i18n.locale.split('-')[0]; // prevent 'en-us' or anything else
	const locale = i18n.locales[id];
	let base = '/';
	if (locale && (!locale.default || i18n.prefixDefaultLocale)) base += i18n.locale;
	// if (!base.endsWith('/')) base += '/';
	if (base.endsWith('/')) base = base.slice(0, -1);
	return base;
}

export default routes;
export { routes, getBasePath };
