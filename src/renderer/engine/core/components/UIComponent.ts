import Component from "./Component"

export default class UIComponent extends Component {
	static get componentKey(): Components {
		return Components.UI
	}
	get componentKey(): Components {
		return UIComponent.componentKey
	}
	__element?: HTMLElement
	uiLayoutID?: string
	wrapperStyles: [string, string][] = []
	anchorElement?: string = ""
}

