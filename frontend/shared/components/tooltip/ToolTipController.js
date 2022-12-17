import createPortal from "../create-portal";

export default class ToolTipController {
    static #initialized = false
    static portal = createPortal(999, false)
    static element
    static closeCurrent

    static initialize() {
        if (ToolTipController.#initialized)
            return

        document.addEventListener("dragstart", () => {
            ToolTipController.portal.close()
            if (ToolTipController.closeCurrent)
                ToolTipController.closeCurrent()
        })
        ToolTipController.#initialized = true
        const el = document.createElement("div")
        el.classList.add("tooltip")
        ToolTipController.portal.create(el)

        ToolTipController.element = el
    }

}