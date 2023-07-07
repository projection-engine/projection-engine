import LocalizationEN from "../../../../shared/enums/LocalizationEN"
import AbstractSingleton from "../../../../shared/AbstractSingleton"
import ContextMenuService from "../../../shared/lib/context-menu/ContextMenuService"


export default class TabContextController extends AbstractSingleton {
	activeContext?: Function
	contexts = new Map<string, Function>()
	contextElements = new Map<string, HTMLElement>()
	contextID = crypto.randomUUID()

	constructor() {
		super()
		// TODO - ADD OPTIONS AND INTEGRATE WITH TABS
		ContextMenuService.getInstance()
			.mount(
				[
					{
						label: LocalizationEN.CLOSE_ALL,
						callback: () => this.activeContext?.("CLOSE_ALL")
					},
					{
						label: LocalizationEN.CREATE,
						callback: () => this.activeContext?.("CREATE")
					}
				],
				this.contextID
			)
		document.addEventListener("mousedown", this.#handler.bind(this))
	}

	static getInstance(): TabContextController {
		return super.get<TabContextController>()
	}

	#handler(e: MouseEvent) {
		const target = e.composedPath().map((element: HTMLElement) => {
			const t = this.contexts.get(element?.id)
			if (t)
				return t
			return null
		})
		this.activeContext = target.find(t => t !== null)
	}

	registerContext(id: string, callback: Function) {
		this.contextElements.set(id, document.getElementById(id))
		this.contexts.set(id, callback)
	}

	removeContext(id: string) {
		this.contexts.delete(id)
	}
}