<template>
	<div class="language-picker" :class="(labelType, { active })">
		<div class="language-picker-current">
			<span v-text="currentLocale[labelType]" />
			<div class="language-picker-arrow" />
		</div>
		<select
			ref="selector"
			class="language-picker-select"
			@input="pickLocale"
			@blur="pickLocale"
		>
			<option
				v-for="locale in locales"
				:key="locale.id"
				:value="locale.id"
				:selected="locale.selected"
				v-text="locale.text"
			/>
		</select>
	</div>
</template>

<script setup>
	import { wait } from '@cafe-noisette/philbin/utils/async';
	import { app } from '@cafe-noisette/philbin/vue/app';
	import project from '@config/project';
	import { onMounted, ref } from 'vue';

	const active = ref(false);

	onMounted(async () => {
		await wait(500);
		active.value = true;
	});

	const props = defineProps({
		labelType: { type: String, default: 'name' },
	});

	const labelType = ['name', 'language', 'code', 'id'].includes(props.labelType)
		? props.labelType
		: 'name';

	const selector = ref(false);

	const i18n = app.$i18n;
	const prefixDefaultLocale = !!i18n.prefixDefaultLocale;
	const slash = i18n.trailingSlash ? '/' : '';

	const currentLocale = i18n.locales[i18n.locale];
	const locales = Object.values(i18n.locales).map((v, i) => ({
		id: v.id,
		text: v[labelType],
		selected: v.id === currentLocale.id ? true : null,
	}));

	function pickLocale() {
		const input = selector.value;
		const selectedID = input.options[input.selectedIndex].value;
		const selectedLocale = i18n.locales[selectedID];

		// Same locale than current - do nothing
		if (selectedLocale.id === currentLocale.id) return;

		// Set preferred language to cookies (14 days expiration)
		let expire = new Date();
		expire.setTime(Date.now() + 3600000 * 24 * 14);
		document.cookie =
			'preferred_locale=' +
			selectedLocale.id +
			';path=' +
			'/' +
			';expires=' +
			expire +
			';samesite=lax';

		// Redirect to current locale root
		const localePrefix =
			!selectedLocale.default || prefixDefaultLocale ? selectedLocale.id + slash : '';

		let lastPath = '';
		for (let i = 0; i < project.router.routes.length; i++) {
			const path = project.router.routes[i].path;

			if (path === '/') continue;

			const t = window.location.href.split(path);
			if (t.length < 2) continue;
			lastPath = path;
			break;
		}

		window.location.href =
			window.location.origin + (localePrefix === '' ? '' : '/') + localePrefix + lastPath;
	}
</script>

<style lang="scss">
	$defaultArrowSize: 0.4em;
	$defaultArrowWidth: 0.4em;

	.language-picker {
		--arrow-size: 0.6em;
		--arrow-width: 1px;

		z-index: 10;
		display: block;
		position: fixed;
		top: 5%;
		left: 1.5rem;
		font: inherit;
		font-size: 0.7em;
		line-height: 0.9;
		cursor: pointer;

		transform: translateX(-200%);
		pointer-events: none;

		&:not(.name, .code) {
			span,
			select,
			select option {
				text-transform: uppercase;
			}
		}

		&.active {
			transition: transform 1s ease(in-out-cubic);
			transform: translateX(0);
			pointer-events: all;
		}

		.language-picker-current {
			position: relative;
			z-index: 0;
			word-break: keep-all;
			white-space: nowrap;
			pointer-events: none;

			display: flex;
			align-items: center;
			justify-content: space-between;
			width: max-content;

			span {
				color: color(white);
				mix-blend-mode: difference;
				margin-right: 0.4rem;
			}
		}

		.language-picker-arrow {
			isolation: isolate;
			position: relative;
			top: calc(var(--arrow-size, $defaultArrowSize) * -0.3);
			z-index: 2;
			width: var(--arrow-size, $defaultArrowSize);
			height: var(--arrow-size, $defaultArrowSize);
			pointer-events: none;
			color: color(white);
			border: currentColor;
			border-right: var(--arrow-width, $defaultArrowWidth) solid;
			border-bottom: var(--arrow-width, $defaultArrowWidth) solid;
			transform: rotate(45deg);
		}

		.language-picker-select {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
			width: 100%;
			height: 100%;
			font: inherit;
			font-size: 16px;
			cursor: pointer;
			border: none;
			opacity: 0.001;
			appearance: none;

			option {
				color: black;
				color: initial;
			}
		}
	}
</style>
