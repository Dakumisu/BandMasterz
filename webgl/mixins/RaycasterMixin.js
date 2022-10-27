import { createLogger } from '@cafe-noisette/philbin/utils/debug';
import { w } from '@cafe-noisette/philbin/utils/state';
import BaseMixin from '@cafe-noisette/philbin/webgl/mixins/BaseMixin';
import { watch } from 'vue';

/// #if DEBUG
const log = createLogger('Mixin·Raycaster', '#000', '#FED9B7').log;
/// #else
/// #code const log = () => {};
/// #endif

export default class RaycasterMixin extends BaseMixin {
	created() {
		this.base.raycaster = {
			isRaycasting: w(false),
			hasClicked: w(false),
			hasPressed: w(false),

			enter: enter.bind(this.base),
			leave: leave.bind(this.base),
			press: press.bind(this.base),
			release: release.bind(this.base),
			reset: reset.bind(this.base),
		};

		this.webgl.raycastingObjects.push(this.base);

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
	if (!this.isInit) return;
	// log('enter');
	this.raycastEnter();
}

function leave() {
	if (!this.isInit) return;
	// log('leave');
	if (this.webgl.$app.$controls.touch.pressed) this.raycaster.release(true);
	this.raycastLeave();
}

function press() {
	if (!this.isInit) return;
	if (!this.raycaster.isRaycasting.value) return;
	if (this.raycaster.hasClicked.value) return;

	this.raycaster.hasPressed.set(true);

	// log('press');
	this.raycastPress();
}

function release(force = false) {
	if (!this.isInit) return;
	if (!this.raycaster.isRaycasting.value && !force) return;
	if (!this.raycaster.hasPressed.value) return;
	if (this.raycaster.hasClicked.value) return;

	// log('release');
	this.raycaster.hasPressed.set(false);

	this.raycastRelease();

	if (this.raycaster.isRaycasting.value) {
		log('click', this.name);
		// this.raycaster.hasClicked.set(true);
		this.raycastClick();
	}
}

function reset() {
	if (!this.isInit) return;
	this.raycaster.hasClicked.set(false);
}
