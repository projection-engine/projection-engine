import pixel from "../data/pixel.png"

export default class DragDropController {
    static tooltip
    static dragData
    static onDragTarget
    static dragImage

    static #initialized = false
    static onLeave() {
        if (!DragDropController.tooltip)
            return
        DragDropController.tooltip.dragDropListeners.removeOverlay()
        DragDropController.tooltip.style.opacity = 1
        DragDropController.tooltip = undefined
    }

    static initialize() {
        if (DragDropController.#initialized)
            return

        function onHover(event) {
            if (DragDropController.tooltip !== event.target && event.target.dragDropListeners != null && !event.target.isDisabled) {
                event.preventDefault()
                DragDropController.onLeave()

                DragDropController.tooltip = event.target
                DragDropController.tooltip.style.opacity = .5
                DragDropController.tooltip.dragDropListeners.dragOver(event)
            }
            if (DragDropController.tooltip != null)
                event.preventDefault()

        }

        function onDrop(event) {
            event.preventDefault()
            console.log(DragDropController.tooltip, DragDropController.tooltip?.dragDropListeners, DragDropController.dragData)
            if (DragDropController.tooltip != null) {
                DragDropController.tooltip.dragDropListeners.onDrop(DragDropController.dragData, event)
                DragDropController.onLeave()
            }
        }

        document.addEventListener("drop", onDrop)
        document.addEventListener("dragover", onHover)

        DragDropController.#initialized = true

        const el = document.createElement("img")
        el.src = pixel

        DragDropController.dragImage = el
    }
}