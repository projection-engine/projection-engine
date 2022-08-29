import KEYS from "../../../libs/engine/production/data/KEYS";

export default class HotKeys {
    static activeView
    static views = new Map()
    static holding = new Map()
    static #onUpdate = () => null

    static initializeListener(onUpdate) {
        HotKeys.#onUpdate = () => onUpdate(HotKeys.views.get(HotKeys.activeView))

        function handler(event) {
            const h = HotKeys.holding

            if (event.repeat)
                return
            // event.preventDefault()
            const activeView = HotKeys.views.get(HotKeys.activeView)
            const tagName= document.activeElement?.tagName
            if (tagName === "INPUT" || tagName === "TEXTAREA"|| !activeView)
                return

            const keysToTest = activeView.actions.length
            if (event.type === "keydown") {
                if (event.ctrlKey) {
                    h.set(KEYS.ControlLeft, true)
                    h.set(KEYS.ControlRight, true)
                }

                h.set(event.code, true)
                for (let i = 0; i < keysToTest; i++) {
                    const currentAction = activeView.actions[i]
                    let valid = true
                    const required = currentAction.require
                    let toRemove = 0
                    if(h.get(KEYS.ControlLeft))
                        toRemove++
                    if(h.get(KEYS.ShiftLeft))
                        toRemove++
                    if(required.length === (h.size - toRemove)) {
                        for (let j = 0; j < required.length; j++)
                            valid = valid && h.get(required[j])
                        if (valid && !currentAction.disabled && currentAction.callback != null)
                            currentAction.callback()
                    }
                }
            } else {
                if (event.code === KEYS.ControlLeft || event.code === KEYS.ControlRight) {
                    h.delete(KEYS.ControlLeft)
                    h.delete(KEYS.ControlRight)
                } else
                    h.delete(event.code)
            }
        }

        document.addEventListener("keydown", handler)
        document.addEventListener("keyup", handler)
    }

    static bindAction(element, actions, icon, label) {
        const handler = () => {
            HotKeys.activeView = element
            HotKeys.holding.clear()
            HotKeys.#onUpdate()
        }

        HotKeys.views.set(element, {actions, icon, label, handler})
        element.addEventListener("mouseenter", handler)
    }

    static unbindAction(element) {
        const found = HotKeys.views.get(element)
        if (!found)
            return
        const {handler} = found
        element.removeEventListener("mouseenter", handler)
        HotKeys.views.delete(element)
    }
}