<template>
	<main class="ui" v-if="$preloader.finished">
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
	/// #if DEBUG
	const routesList = [
		{ label: 'Home', to: { name: 'Home' } },
		{ label: 'Game', to: { name: 'Game' } },
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

		.title {
			position: absolute;
			left: 1em;
			top: 2em;
			font-size: 1em;
		}
	}

	.debug-gui {
		z-index: z(debug);
	}
</style>
