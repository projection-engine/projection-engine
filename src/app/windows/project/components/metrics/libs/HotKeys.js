import KEYS from "../../../libs/engine/production/data/KEYS";

export default class HotKeys {
    static activeView
    static views = new Map()
    static holding = new Map()
    static #onUpdate = () => null

    static initializeListener(onUpdate) {
        HotKeys.#onUpdate = () => onUpdate(HotKeys.views.get(HotKeys.activeView))

        function handler(event) {

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
                    HotKeys.holding.set(KEYS.ControlLeft, true)
                    HotKeys.holding.set(KEYS.ControlRight, true)
                }

                HotKeys.holding.set(event.code, true)
                console.log(event.code, HotKeys.holding)
                for (let i = 0; i < keysToTest; i++) {
                    const currentAction = activeView.actions[i]
                    let valid = true
                    const required = currentAction.require
                    for (let j = 0; j < required.length; j++)
                        valid = valid && HotKeys.holding.get(required[j])
                    if (valid && !currentAction.disabled && currentAction.callback != null)
                        currentAction.callback()
                }
            } else {
                if (event.code === KEYS.ControlLeft || event.code === KEYS.ControlRight) {
                    HotKeys.holding.delete(KEYS.ControlLeft)
                    HotKeys.holding.delete(KEYS.ControlRight)
                } else
                    HotKeys.holding.delete(event.code)
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