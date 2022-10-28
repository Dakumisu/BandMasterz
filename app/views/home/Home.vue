<template>
	<section class="page page-home">
		<!-- <h1 class="title">{{ $t('home.title') }}</h1> -->
		<span>Merci <b>enzo</b> gros bg</span>
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

	span {
		color: red;
		position: absolute;
		bottom: 1rem;
		right: 0rem;
		font-size: 0.7rem;
	}
</style>
