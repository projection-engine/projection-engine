import ContextMenuOption from "./templates/ContextMenuOptions"
import findOptions from "./utils/find-options"
import ContextMenuTarget from "./templates/ContextMenuTarget"
import getContextAction from "./utils/get-context-action"
import ElectronResources from "../ElectronResources"
import IPCRoutes from "../../../../../shared/enums/IPCRoutes"
import AbstractSingleton from "../../../../../shared/AbstractSingleton"
import MappedOption from "./templates/MappedOption"
import getOptionID from "./utils/get-option-id"

export default class ContextMenuService extends AbstractSingleton{
	blockContext = false
	currentX = -1
	currentY = -1

	data: { targets: { [key: string]: ContextMenuTarget }, focused?: ContextMenuTarget } = {
		targets: {},
		focused: undefined
	}

	constructor() {
		super()
		ElectronResources.ipcRenderer.on(IPCRoutes.CONTEXT_MENU_CALLBACK, (ev, {id, group}) => {
			const groupData = this.data.targets[group]
			if (!groupData)
				return
			groupData.options.forEach(o => findOptions(o, id, group))
		})
		document.addEventListener("contextmenu", getContextAction())
	}

	static getInstance(): ContextMenuService{
		return super.get<ContextMenuService>()
	}

	mount(options: ContextMenuOption[], target: string | null, onFocus?: Function) {
		const template = this.#buildOptions(options, target)
		ElectronResources.ipcRenderer.send(IPCRoutes.REGISTER_CONTEXT_MENU, {
			id: target,
			template
		})

		this.data.targets[target] = {
			id: target,
			options,
			triggers: [],
			onFocus,
			template
		}
	}

	destroy(target: string | null) {
		ElectronResources.ipcRenderer.send(IPCRoutes.DESTROY_CONTEXT_MENU, target)
		const old = this.data.targets[target]
		if (!old)
			return
		delete this.data.targets[target]
	}

	#buildOptions(options: ContextMenuOption[], id: string|null): MappedOption[]{
		const template: MappedOption[] = []
		for (let i = 0; i < options.length; i++){
			const option = options[i]
			if (option.divider)
				template.push({type: "separator"})
			else {
				const internalID = getOptionID(option.label, id)
				const cb = option.onClick || option.callback

				if (cb) {

					const temp = <MappedOption>{
						label: option.label,
						id: internalID
					}
					if (option.require) {
						const mapped = option.require.map(r => {
							const lower = r.toLowerCase()
							if (lower.includes("control"))
								return "CmdOrCtrl"
							if (lower.includes("alt"))
								return "Alt"
							if (lower.includes("shift"))
								return "Shift"

							return r.toUpperCase().replace("KEY", "").replace("ARROW", "")
						})
						temp.accelerator = mapped.join("+")
					}
					template.push(temp)
				} else if (Array.isArray(option.children) && option.children.length > 0)
					template.push({
						label: option.label,
						id: internalID,
						submenu: this.#buildOptions(option.children, id)
					})

			}
		}
		return template
	}
}