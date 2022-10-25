import BaseComponent from '@cafe-noisette/philbin/webgl/components/BaseComponent';
import RaycasterMixin from '@webgl/mixins/RaycasterMixin';

class BaseInstrument extends BaseComponent {
	get mixins() {
		return [RaycasterMixin];
	}

	init() {
		this.log('init ' + this.name);
	}

	enter() {}
	leave() {}

	press() {}
	release() {}

	click() {}

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
