<template>
	<main class="ui" v-if="$preloader.finished">
		<img alt="Vue logo" class="logo" src="@assets/img/logo.png" width="125" height="125" />

		<HelloWorld />

		<nav>
			<RouterLink to="/">Home</RouterLink>
			<RouterLink to="/about">About</RouterLink>
		</nav>

		<LanguagePicker labelType="language" />

		<CustomRouterView />
	</main>

	<Webgl />

	{{
	/// #if DEBUG
	}}
	<Debug>
		<GUI />
		<RoutesSelector :routes="routesList" />
	</Debug>
	{{
	/// #endif
	}}
</template>

<script setup>
	import LanguagePicker from '@app/components/common/LanguagePicker.vue';
	import HelloWorld from '@app/components/HelloWorld.vue';
	import { RouterLink } from 'vue-router';

	/// #if DEBUG
	const routesList = [
		{ label: 'Home', to: { name: 'Home' } },
		{ label: 'About', to: { name: 'About' } },
	];
	/// #endif
</script>

<style lang="scss">
	.webgl-wrapper {
		z-index: z(webgl);
		pointer-events: none;
	}

	.ui {
		z-index: z(ui);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		max-width: 100vw;
		min-height: 100vh;
	}

	.page {
		position: fixed;
		top: 0;
		left: 0;
		z-index: z(pages);
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: center;
		padding: var(--padding);
		overflow: hidden;
		width: 100vw;
		height: 100vh;
	}

	.debug-gui {
		z-index: z(debug);
	}

	.logo {
		display: block;
		margin: 0 auto 2rem;
	}

	a,
	.green {
		text-decoration: none;
		color: #00bd7e;
		transition: 0.4s;
	}

	nav {
		width: 100%;
		font-size: 12px;
		text-align: center;
		margin-top: 2rem;
		z-index: calc(z(pages) + 1);

		a {
			display: inline-block;
			padding: 0 1rem;
			border-left: 1px solid black;

			&:first-of-type {
				border: 0;
			}

			&.router-link-exact-active {
				color: red;

				@include hover-and-touch() {
					background-color: #85ffd68e;
				}
			}
		}
	}

	@include below(bpw(sm)) {
		body {
			display: flex;
			place-items: center;
		}

		header .wrapper {
			display: flex;
			place-items: flex-start;
			flex-wrap: wrap;
		}

		.logo {
			margin: 0 2rem 0 0;
		}

		nav {
			text-align: left;
			margin-left: -1rem;
			font-size: 1rem;

			padding: 1rem 0;
			margin-top: 1rem;
		}
	}
</style>
