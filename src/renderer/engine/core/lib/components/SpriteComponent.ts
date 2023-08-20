import Component from "./Component"
import {Components,} from "@engine-core/engine.enum";

export default class SpriteComponent extends Component {
	getDependencies(): Components[] {
		return [Components.TRANSFORMATION, Components.CULLING];
	}

	static get componentKey(): Components {
		return Components.SPRITE
	}
	getComponentKey(): Components {
		return SpriteComponent.componentKey
	}
	imageID?: string
	attributes: [number, number] = [0, 0]

	get alwaysFaceCamera() {
		return this.attributes[0] === 1
	}

	get keepSameSize() {
		return this.attributes[1] === 1
	}


	set alwaysFaceCamera(d) {
		this.attributes[0] = d ? 1 : 0
	}

	set keepSameSize(d) {
		this.attributes[1] = d ? 1 : 0
	}
}
