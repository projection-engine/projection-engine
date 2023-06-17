import ContextMenuOption from "./templates/ContextMenuOptions"
import findOptions from "./utils/find-options"
import buildOptions from "./utils/build-options"
import ContextMenuTarget from "./templates/ContextMenuTarget"

import getContextAction from "./utils/get-context-action"
import ElectronResources from "../ElectronResources"
import IPCRoutes from "../../../../shared/IPCRoutes";
import AbstractSingleton from "../../../../shared/AbstractSingleton";

export default class ContextMenuService extends AbstractSingleton{
	blockContext = false
	currentX = -1
	currentY = -1

	data: { targets: { [key: string]: ContextMenuTarget }, focused?: ContextMenuTarget } = {
		targets: {},
		focused: undefined
	}

	constructor() {
		super();
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
		const template = buildOptions(options, target)
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
}