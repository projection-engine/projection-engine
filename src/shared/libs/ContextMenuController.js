import ROUTES from "../../static/ROUTES";

const {ipcRenderer} = window.require("electron")

function buildOptions(options, id, listeners) {
    const template = []
    options.forEach(option => {
        if (option.divider)
            template.push({type: "separator"})
        else {
            const internalID = option.label.toUpperCase().trim() + id
            console.log(option.onClick)
            if(option.onClick) {
                ipcRenderer.on(internalID, option.onClick)
                listeners[internalID] = option.onClick
                template.push({
                    label: option.label,
                    id: internalID,
                    submenu: option.children ? buildOptions(option.children, id, listeners) : undefined
                })
            }
        }
    })
    return template
}

export default class ContextMenuController {
    static data = {targets: {}, focused: undefined}

    static mount(metadata, options, target, triggers = [], onFocus) {
        const listeners = {}
        ipcRenderer.send(ROUTES.REGISTER_CONTEXT_MENU + sessionStorage.getItem("electronWindowID"), {
            id: target,
            template: buildOptions(options, target, listeners)
        })

        ContextMenuController.data.targets[target] = {
            id: target,
            options,
            triggers,
            onFocus,
            metadata,
            listeners
        }
    }

    static destroy(target) {
        ipcRenderer.send(ROUTES.DESTROY_CONTEXT_MENU + sessionStorage.getItem("electronWindowID"), target)
        const old = ContextMenuController.data.targets[target]
        if (!old)
            return

        Object.entries(old.listeners).forEach(([internalID, onClick]) => {
            console.log(onClick)
            ipcRenderer.removeListener(internalID, onClick)
        })
        delete ContextMenuController.data.targets[target]
    }
}