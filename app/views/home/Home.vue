<template>
	<section class="page page-home">
		<h1 class="title">{{ $t('home.title') }}</h1>
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
	.page-home {
		color: white;
	}
</style>
