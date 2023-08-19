import Component from "./Component"
import {Components,} from "@engine-core/engine.enum";

export default class UIComponent extends Component {
	getDependencies(): Components[] {
		return [];
	}

	static get componentKey(): Components {
		return Components.UI
	}
	getComponentKey(): Components {
		return UIComponent.componentKey
	}
	__element?: HTMLElement
	uiLayoutID?: string
	wrapperStyles: [string, string][] = []
	anchorElement?: string = ""
}

