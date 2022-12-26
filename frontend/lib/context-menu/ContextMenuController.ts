import ContextMenuOption from "./templates/ContextMenuOptions";
import findOptions from "./utils/find-options";
import buildOptions from "./utils/build-options";
import ContextMenuTarget from "./templates/ContextMenuTarget";

const {ipcRenderer} = window.require("electron")

export default class ContextMenuController {
    static data: { targets: { [key: string]: ContextMenuTarget }, focused?: ContextMenuTarget } = {
        targets: {},
        focused: undefined
    }
    static #initialized = false

    static mount(options: ContextMenuOption[], target: string | null, triggers?: string[], onFocus?: Function) {
        if (!ContextMenuController.#initialized) {
            ipcRenderer.on("context-menu", (ev, {id, group}) => {
                const groupData = ContextMenuController.data.targets[group]
                if (!groupData)
                    return
                groupData.options.forEach(o => findOptions(o, id, group))
            })
            ContextMenuController.#initialized = true
        }

        const template = buildOptions(options, target)
        ipcRenderer.send("REGISTER_CONTEXT_MENU", {
            id: target,
            template
        })

        ContextMenuController.data.targets[target] = {
            id: target,
            options,
            triggers: triggers || [],
            onFocus,
            template
        }
    }

    static destroy(target: string | null) {
        ipcRenderer.send("DESTROY_CONTEXT_MENU", target)
        const old = ContextMenuController.data.targets[target]
        if (!old)
            return
        delete ContextMenuController.data.targets[target]
    }
}