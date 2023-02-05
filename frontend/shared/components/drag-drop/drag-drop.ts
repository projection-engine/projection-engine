import DragDropController from "./DragDropController";

interface DragDropAttributes {
    noTransformation?: boolean
    targetElement?: HTMLElement
    onDragStart?: Function
    onDrop?: Function
    onMouseMove?: Function
    dragImage?: Function
    onDragOver?: Function
    onDragEnd?: Function
}

export default function dragDrop(draggable) {
    let dragImageElement,
        noTargetTransformation,
        onDragStartEvent,
        onDragOverEvent,
        draggableElement,
        onDragEndEvent,
        getDragImage


    const handler = (event) => {
        switch (event.type) {
            case "dragleave":
                if (!draggableElement.contains(event.relatedTarget))
                    DragDropController.onLeave()
                break
            case "drag":

                if (this.onMouseMove)
                    this.onMouseMove(event, draggableElement, DragDropController.dragData)
                break
            case "dragstart":
                if (draggableElement.isDisabled) {
                    event.preventDefault()
                    return
                }
                if (dragImageElement) {
                    dragImageElement.style.position = "absolute"
                    dragImageElement.style.top = "0px"
                    dragImageElement.style.right = "100%"
                    if (!dragImageElement.parentElement)
                        document.body.appendChild(dragImageElement);
                    if (getDragImage)
                        dragImageElement.innerHTML = getDragImage()
                    event.dataTransfer.setDragImage(dragImageElement, 0, 0)
                }
                DragDropController.dragData = onDragStartEvent(event)


                DragDropController.dragImageElement = dragImageElement
                DragDropController.onDragTarget = draggableElement

                break
            case "dragend":
                event.preventDefault()
                if (onDragEndEvent)
                    onDragEndEvent()

                DragDropController.dragData = undefined
                break
            case "dragover":
                event.preventDefault()
                DragDropController.dropTarget = draggableElement
                DragDropController.changedElements.push(draggableElement)
                draggableElement.style.opacity = ".5"
                draggableElement.dragDropListeners.dragOver(event)
                break
            case "drop":
                event.preventDefault()
                if (!DragDropController.dropTarget)
                    return;

                draggableElement.dragDropListeners.onDrop(DragDropController.dragData, event)
                DragDropController.onLeave()

                break
        }
    }


    return {
        onMount: (attributes: DragDropAttributes) => {
            const {
                noTransformation,
                targetElement,
                onDragStart,
                onDrop,
                onMouseMove,
                dragImage,
                onDragOver,
                onDragEnd
            } = attributes
            DragDropController.initialize()
            draggableElement = targetElement
            noTargetTransformation = noTransformation
            if (typeof dragImage === "function")
                getDragImage = dragImage
            dragImageElement = DragDropController.createElement(getDragImage ? getDragImage() : dragImage)

            onDragOverEvent = onDragOver
            onDragEndEvent = onDragEnd

            draggableElement.dragDropListeners = {
                onDrop,
                dragOver: (event) => {
                    if(!onDragOverEvent)
                        return;
                    const target = DragDropController.alertModal
                    const html = onDragOverEvent(DragDropController.dragData, event)

                    if (!html)
                        return
                    target.innerHTML = html
                    target.style.zIndex = "9999"
                }
            }
            onDragStartEvent = onDragStart
            this.onMouseMove = onMouseMove

            if (draggable) {
                draggableElement.draggable = true
                draggableElement.addEventListener("dragstart", handler)
                draggableElement.addEventListener("dragend", handler)
                draggableElement.addEventListener("drag", handler)
            }

            draggableElement.addEventListener("dragover", handler)
            draggableElement.addEventListener("dragleave", handler)
            draggableElement.addEventListener("drop", handler)
        },
        onDestroy: () => {
            if (draggableElement) {
                draggableElement.removeEventListener("dragstart", handler)
                draggableElement.removeEventListener("dragend", handler)
                draggableElement.removeEventListener("drag", handler)
                draggableElement.removeEventListener("dragleave", handler)
                draggableElement.removeEventListener("dragover", handler)
                draggableElement.removeEventListener("drop", handler)
            }
        },

        set onDragStart(data) {
            onDragStartEvent = data
        },
        set onDragOver(data) {
            onDragOverEvent = data
        },
        set dragImage(data) {
            if (dragImageElement)
                dragImageElement.innerHTML = data
        },

        set disabled(data) {
            if (draggableElement != null) {
                draggableElement.isDisabled = !!data
                draggableElement.draggable = !data
            }
        }
    }
}