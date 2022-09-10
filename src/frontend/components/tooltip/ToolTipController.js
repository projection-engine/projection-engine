import createPortal from "../create-portal";

export default class ToolTipController {
    static #initialized = false
    static portal = createPortal(999, false)
    static element
    static initialize() {
        if (ToolTipController.#initialized)
            return
        ToolTipController.#initialized = true
        const el = document.createElement("div")
        el.setAttribute("data-tooltip", "-")
        ToolTipController.portal.create(el)

        ToolTipController.element = el
    }

}