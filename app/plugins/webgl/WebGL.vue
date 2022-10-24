<template>
	<aside v-once ref="wrapper" class="webgl-wrapper" />
</template>

<script setup>
	import { inject, onMounted, onUnmounted, ref } from 'vue';

	const wrapper = ref();
	const webgl = inject('webgl', null);
	let canvas = ref();

	onMounted(() => {
		if (webgl.canvas) {
			canvas.value = webgl.canvas;
			canvas.value.classList.add('webgl-canvas');
			wrapper.value.appendChild(canvas.value);
		}
	});

	onUnmounted(() => {
		if (canvas.value && canvas.value.parentNode === wrapper.value) {
			wrapper.value.removeChild(canvas.value);
		}
		canvas.value = null;
	});

	defineExpose({ wrapper, canvas });
</script>

<style lang="scss">
	.webgl-wrapper {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		overflow: hidden;
		overflow: clip;
		user-select: none;
		contain: strict;
	}

	.webgl-canvas {
		outline: none;
	}
</style>
