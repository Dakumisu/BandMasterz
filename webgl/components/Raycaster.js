import { w } from '@cafe-noisette/philbin/utils/state';
import BaseComponent from '@cafe-noisette/philbin/webgl/components/BaseComponent';
import { ArrowHelper, Raycaster, Vector3 } from 'three';
import { watchEffect } from 'vue';

const ORIGIN = new Vector3();
const DIRECTION = new Vector3(0, 0, -1);

export default class Raycast extends BaseComponent {
	init() {
		const ray = (this.base = new Raycaster());
		ray.set(ORIGIN, DIRECTION);
		ray.params.Points.threshold = 0.4;

		/// #if DEBUG
		this.helper = {
			arrow: new ArrowHelper(ray.direction, ray.origin, 8, 0xff0000),
			active: w(false),
		};

		this.helper.watcher = this.helper.active.watchImmediate(
			(v) => (this.helper.arrow.visible = v),
		);
		/// #endif

		// this.log('init Raycast');
	}

	enter(el) {
		this.log('enter', el);
	}

	leave(el) {
		this.log('leave', el);
	}

	update() {
		const mouse = this.webgl.$app.$controls.touch.normalizePos;
		const cam = this.webgl.scene._cam.current.base;

		this.base.setFromCamera(mouse, cam);

		this.webgl.raycastingObjects.map((el) => {
			const intersects = this.base.intersectObject(el.base, true);
			el.raycaster.isRaycasting.set(intersects.length > 0);
		});

		/// #if DEBUG
		this.helper.arrow.position.copy(mouse);
		/// #endif
	}

	beforeDestroy() {
		/// #if DEBUG
		this.helper.watcher();
		/// #endif
	}

	devtools() {
		const gui = this.webgl.$gui.addFolder({ title: 'Raycast', index: 1 });

		gui.addInput(this.helper, 'active', {
			label: 'Show Helper',
			value: 0,
		}).on('change', (v) => this.helper.active.set(v.value));
	}
}
