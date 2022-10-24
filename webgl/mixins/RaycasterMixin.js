import { createLogger } from '@cafe-noisette/philbin/utils/debug';
import { w } from '@cafe-noisette/philbin/utils/state';
import BaseMixin from '@cafe-noisette/philbin/webgl/mixins/BaseMixin';
import { Raycaster } from 'three';
import { watch, watchEffect } from 'vue';

export default class RaycasterMixin extends BaseMixin {
	created() {
		this.base.raycaster = {
			isRaycasting: w(false),
			hasClicked: w(false),

			enter: enter.bind(this),
			leave: leave.bind(this),
			press: press.bind(this),
			release: release.bind(this),
			reset: reset.bind(this),
		};

		if (!this.webgl.raycastingObjects) this.webgl.raycastingObjects = [];

		this.webgl.raycastingObjects.push(this.base);

		this.name = 'Raycaster';
		this.log = createLogger('Mixin·' + this.name + '·' + this.base.name, '#000', '#FED9B7').log;

		this.base.raycaster.hoverWatcher = this.base.raycaster.isRaycasting.watchImmediate((v) =>
			v ? this.base.raycaster.enter() : this.base.raycaster.leave(),
		);

		this.base.raycaster.clickWatcher = watch(
			() => this.webgl.$app.$controls.touch.pressed,
			(v) => {
				v ? this.base.raycaster.press() : this.base.raycaster.release();
			},
			{ immediate: true },
		);
	}

	beforeDestroy() {
		this.base.raycaster.hoverWatcher();
		this.base.raycaster.clickWatcher();
		this.webgl.raycastingObjects.splice(this.webgl.raycastingObjects.indexOf(this.base), 1);
	}
}

function enter() {
	// this.log('enter');

	this.base.enter();
}

function leave() {
	// this.log('leave');
	if (this.webgl.$app.$controls.touch.pressed) this.base.raycaster.release(true);

	this.base.leave();
}

function press() {
	if (!this.base.raycaster.isRaycasting.value) return;
	if (this.base.raycaster.hasClicked.value) return;

	// this.log('press');
	this.base.press();
}

function release(force = false) {
	if (!this.base.raycaster.isRaycasting.value && !force) return;
	if (this.base.raycaster.hasClicked.value) return;

	// this.log('release');

	this.base.release();

	if (this.base.raycaster.isRaycasting.value) {
		this.log('click');
		this.base.raycaster.hasClicked.set(true);
		this.base.click();
	}
}

function reset() {
	this.base.raycaster.hasClicked.set(false);
}
