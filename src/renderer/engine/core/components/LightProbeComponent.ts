import Component from "./Component"
import LIGHT_PROBE_PROPS from "../static/component-props/LIGHT_PROBE_PROPS"
import {Components,} from "@engine-core/engine.enum";

export default class LightProbeComponent extends Component {
	static get componentKey(): Components {
		return Components.LIGHT_PROBE
	}
	getComponentKey(): Components {
		return LightProbeComponent.componentKey
	}
	_props = LIGHT_PROBE_PROPS
	mipmaps = 6
	maxDistance = 50
}
