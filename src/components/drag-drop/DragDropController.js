import STYLES from "./STYLES";

export default class DragDropController {
    static dropTarget
    static dragData
    static onDragTarget
    static dataTransfer
    static #initialized = false
    static alertModal

    static onLeave() {
        if (!DragDropController.dropTarget)
            return

        DragDropController.alertModal.innerHTML = ""
        DragDropController.alertModal.style.zIndex = "-1"
        DragDropController.dropTarget.style.opacity = "1"
        DragDropController.dropTarget = undefined
    }

    static createElement(html) {
        const element = document.createElement("div")
        element.innerHTML = html
        Object.assign(element.style, STYLES)
        return element
    }

    static initialize() {
        if (DragDropController.#initialized)
            return
        DragDropController.alertModal = DragDropController.createElement("")
        DragDropController.alertModal.style.background = "var(--pj-border-primary)"
        DragDropController.alertModal.style.right = "4px"
        DragDropController.alertModal.style.top = "4px"
        DragDropController.alertModal.style.zIndex = "-1"
        document.body.appendChild(DragDropController.alertModal)


        DragDropController.#initialized = true


    }
}