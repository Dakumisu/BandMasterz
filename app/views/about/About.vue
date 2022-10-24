<template>
	<section class="page page-about">
		<p>{{ $t('about.title') }}</p>
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
	.page-about {
		color: white;

		h1 {
			font-size: 2em;
		}
	}
</style>
