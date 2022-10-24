const i18n = {
	// If set to true,
	// the default locale will be prefixed like any other locale (e.g. /en-us)
	// default locale will also be rendered to root for SEO & redirection
	// Default: false
	prefixDefaultLocale: false,

	// Force trailing slashes on redirection urls
	trailingSlash: true,

	// List of locales
	locales: {
		en: {
			id: 'en',
			name: 'English',
			language: 'en',
			region: 'us',
			default: true,
		},
	},
};

export default i18n;
export { i18n };
