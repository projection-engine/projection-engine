import Component from "./Component"
import {Components,} from "@engine-core/engine.enum";

export default class LightProbeComponent extends Component {
	getDependencies(): Components[] {
		return [Components.TRANSFORMATION, Components.CULLING];
	}

	static get componentKey(): Components {
		return Components.LIGHT_PROBE
	}
	getComponentKey(): Components {
		return LightProbeComponent.componentKey
	}

	mipmaps = 6
	maxDistance = 50
}