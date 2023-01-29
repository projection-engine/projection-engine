import ContextMenuOption from "./templates/ContextMenuOptions";
import findOptions from "./utils/find-options";
import buildOptions from "./utils/build-options";
import ContextMenuTarget from "./templates/ContextMenuTarget";
import ROUTES from "../../../backend/static/ROUTES";
import getContextAction from "./utils/get-context-action";

const {ipcRenderer} = window.require("electron")

export default class ContextMenuController {
    static blockContext = false
    static currentX = -1
    static currentY = -1

    static data: { targets: { [key: string]: ContextMenuTarget }, focused?: ContextMenuTarget } = {
        targets: {},
        focused: undefined
    }

    static #initialized = false

    static initialize() {
        if (ContextMenuController.#initialized)
            return
        ipcRenderer.on(ROUTES.CONTEXT_MENU_CALLBACK, (ev, {id, group}) => {
            const groupData = ContextMenuController.data.targets[group]
            if (!groupData)
                return
            groupData.options.forEach(o => findOptions(o, id, group))
        })
        document.addEventListener("contextmenu", getContextAction())

        ContextMenuController.#initialized = true
    }

    static mount(options: ContextMenuOption[], target: string | null, onFocus?: Function) {


        const template = buildOptions(options, target)
        ipcRenderer.send(ROUTES.REGISTER_CONTEXT_MENU, {
            id: target,
            template
        })

        ContextMenuController.data.targets[target] = {
            id: target,
            options,
            triggers: [],
            onFocus,
            template
        }
    }

    static destroy(target: string | null) {
        ipcRenderer.send(ROUTES.DESTROY_CONTEXT_MENU, target)
        const old = ContextMenuController.data.targets[target]
        if (!old)
            return
        delete ContextMenuController.data.targets[target]
    }
}