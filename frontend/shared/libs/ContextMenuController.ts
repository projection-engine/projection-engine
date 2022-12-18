const {ipcRenderer} = window.require("electron")

function getOptionID(label, parent) {
    if (typeof label !== "string")
        console.trace(label)
    return label.toUpperCase().trim() + parent
}

function buildOptions(options, id) {
    const template = []
    options.forEach(option => {
        if (option.divider)
            template.push({type: "separator"})
        else {
            const internalID = getOptionID(option.label, id)
            const cb = option.onClick || option.callback

            if (cb) {

                const temp = {
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
                    submenu: buildOptions(option.children, id)
                })

        }
    })
    return template
}

function findOptions(option, toFind, parent) {
    if (!option.label)
        return

    if (option.children)
        option.children.forEach(c => findOptions(c, toFind, parent))

    if (toFind === getOptionID(option.label, parent)) {
        if (option.onClick != null)
            option.onClick()
        else if (option.callback)
            option.callback()
    }
}

export default class ContextMenuController {
    static data = {targets: {}, focused: undefined}
    static #initialized = false

    static mount(metadata, options, target, triggers = [], onFocus) {
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
            triggers,
            onFocus,
            metadata,
            template
        }
    }

    static destroy(target) {
        ipcRenderer.send("DESTROY_CONTEXT_MENU", target)
        const old = ContextMenuController.data.targets[target]
        if (!old)
            return
        delete ContextMenuController.data.targets[target]
    }
}