import pixel from "../data/pixel.png"

export default class DragDropController {
    static tooltip
    static dragData
    static onDragTarget
    static dragImage

    static #initialized = false

    static initialize(){
        if(DragDropController.#initialized)
            return

        DragDropController.#initialized = true

        const el = document.createElement("img")
        el.src = pixel

        DragDropController.dragImage = el
    }
}