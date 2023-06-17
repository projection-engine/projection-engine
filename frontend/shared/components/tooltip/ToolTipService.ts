import SveltePortal from "../../lib/SveltePortal"
import AbstractSingleton from "../../../../shared/AbstractSingleton";

export default class ToolTipService extends AbstractSingleton {
	portal = new SveltePortal(999, false)
	element
	closeCurrent

	constructor() {
		super();
		document.addEventListener("dragstart", () => {
			this.portal.close()
			if (this.closeCurrent)
				this.closeCurrent()
		})
		const el = document.createElement("div")
		el.classList.add("tooltip")
		el.setAttribute("data-sveltetooltip", "-")
		this.portal.create(el)

		this.element = el
	}

	static getInstance(): ToolTipService{
		return super.get<ToolTipService>()
	}

}