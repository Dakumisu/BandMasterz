<template>
	<section class="page page-game">
		<h1 class="title">{{ $t('game.title') }}</h1>
	</section>
</template>

<script setup>
	import { app } from '@cafe-noisette/philbin/vue/app';

	app.$router.onViewEnter(() => {
		// ...code
	});
	app.$router.onViewLeave(() => {
		// ...code
	});
</script>

<style lang="scss" scoped>
	.page-game {
		color: white;
	}
</style>
