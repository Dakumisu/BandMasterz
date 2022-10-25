import BaseComponent from '@cafe-noisette/philbin/webgl/components/BaseComponent';
import RaycasterMixin from '@webgl/mixins/RaycasterMixin';

class BaseInstrument extends BaseComponent {
	get mixins() {
		return [RaycasterMixin];
	}

	init() {
		this.log('init ' + this.name);
	}

	raycastEnter() {}
	raycastLeave() {}

	raycastPress() {}
	raycastRelease() {}

	raycastClick() {
		this.beat && this.beat();
	}

	play() {}

	beat() {}

	devtools() {
		this.gui
			.addButton({ title: 'Reset Interaction' })
			.on('click', () => this.raycaster.reset());

		this.gui.addButton({ title: 'Play Sample' }).on('click', () => this.play());
	}
}

export { BaseInstrument };
export default BaseInstrument;
