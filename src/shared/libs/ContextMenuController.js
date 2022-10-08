import ROUTES from "../../static/ROUTES";

const {ipcRenderer} = window.require("electron")

function buildOptions(options, id, listeners) {
    const template = []
    options.forEach(option => {
        if (option.divider)
            template.push({type: "separator"})
        else {
            const internalID = option.label.toUpperCase().trim() + id
            const cb = option.onClick || option.callback

            if (cb) {
                ipcRenderer.on(internalID, cb)
                listeners[internalID] = cb
                const temp = {
                    label: option.label,
                    id: internalID
                }
                if (option.require) {
                    const mapped = option.require.map(r => {
                        const lower = r.toLowerCase()
                        console.log(lower)
                        if(lower.includes("control"))
                            return "CmdOrCtrl"
                        if(lower.includes("alt"))
                            return "Alt"
                        if(lower.includes("shift"))
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
                    submenu: buildOptions(option.children, id, listeners)
                })

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

        Object.entries(old.listeners)
            .forEach(([internalID, onClick]) => ipcRenderer.removeListener(internalID, onClick))
        delete ContextMenuController.data.targets[target]
    }
}