import Portal from "../../lib/Portal";

export default class ToolTipController {
    static #initialized = false
    static portal = new Portal(999, false)
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
        el.setAttribute("data-tooltip", "-")
        ToolTipController.portal.create(el)

        ToolTipController.element = el
    }

}