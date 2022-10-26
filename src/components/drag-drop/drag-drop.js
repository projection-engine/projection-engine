import DragDropController from "./DragDropController";

export default function dragDrop(draggable) {
    let dragImageElement, noTargetTransformation, onDragStartEvent, onDragOverEvent,
        draggableElement, onDragEndEvent


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
                draggableElement.style.opacity = ".5"
                draggableElement.dragDropListeners.dragOver(event)
                break
            case "drop":
                event.preventDefault()
                draggableElement.style.opacity = "1"
                if (!DragDropController.dropTarget)
                    return;

                draggableElement.dragDropListeners.onDrop(DragDropController.dragData, event)
                DragDropController.onLeave()

                break
        }
    }


    return {
        onMount: ({
                      noTransformation,
                      targetElement,
                      onDragStart,
                      onDrop,
                      onMouseMove,
                      dragImage,
                      onDragOver,
                      onDragEnd
                  }) => {
            DragDropController.initialize()
            draggableElement = targetElement
            noTargetTransformation = noTransformation
            dragImageElement = DragDropController.createElement(dragImage ? dragImage : "")

            onDragOverEvent = onDragOver
            onDragEndEvent = onDragEnd

            draggableElement.dragDropListeners = {
                onDrop,
                dragOver: (event) => {
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