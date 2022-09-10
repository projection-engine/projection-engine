import DragDropController from "./libs/DragDropController";


const STYLES = {
    position: "absolute",
    background: "rgba(22,22,22,.9)",
    boxShadow: "var(--pj-boxshadow)",
    color: "var(--pj-color-secondary)",
    padding: "4px 8px",
    borderRadius: "3px",
    zIndex: "999",
    display: "grid",
    alignItems: "center",
    justifyContent: "center",
    justifyItems: "center",
    fontSize: ".75rem",
    gap: "8px",
    textAlign: "center"
}
export default function dragDrop(draggable) {
    let bBox, dragImageElement, noTargetTransformation, onDragStartEvent, onDragOverEvent,
        draggableElement,
        disabled, onDragEndEvent, instantiated


    const handler = (event) => {
        switch (event.type) {
            case "dragover":
                event.preventDefault()
                draggableElement.style.opacity = .5
                DragDropController.tooltip = draggableElement
                if(!instantiated){
                    instantiated = true
                    draggableElement.dragDropListeners.dragOver(event)
                }
                break
            case "dragenter":
                draggableElement.dragDropListeners.dragOver(event)
                break
            case "dragleave":
                instantiated =false
                draggableElement.dragDropListeners.removeOverlay()
                draggableElement.style.opacity = 1
                break

            case "drag":
                if (dragImageElement.innerHTML)
                    Object.assign(
                        dragImageElement.style,
                        {
                            left: (event.clientX + 10) + "px",
                            top: (event.clientY + 10 - bBox.height / 2) + "px"
                        }
                    )
                if (this.onMouseMove)
                    this.onMouseMove(event, draggableElement, DragDropController.dragData)
                break
            case "dragstart":
                instantiated = false
                if (disabled) {
                    event.preventDefault()
                    return;
                }
                if (DragDropController.dragImage)
                    event.dataTransfer.setDragImage(DragDropController.dragImage, 0, 0)

                DragDropController.dragData = onDragStartEvent(event)

                if (dragImageElement) {
                    document.body.appendChild(dragImageElement)
                    bBox = dragImageElement.getBoundingClientRect()
                }
                DragDropController.dragImageElement = dragImageElement
                DragDropController.onDragTarget = draggableElement

                break
            case "drop": {
                event.preventDefault()
                draggableElement.dragDropListeners.onDrop(DragDropController.dragData, event)
                instantiated = false
                break
            }
            case "dragend":
                event.preventDefault()
                instantiated = false
                if (DragDropController.tooltip) {
                    DragDropController.tooltip.style.opacity = 1
                    DragDropController.tooltip.dragDropListeners.removeOverlay()
                    DragDropController.tooltip = undefined
                }
                if (onDragEndEvent)
                    onDragEndEvent()

                DragDropController.dragData = undefined
                if (dragImageElement) {
                    try {
                        document.body.removeChild(dragImageElement)
                    } catch (err) {
                        console.error(err)
                    }
                }

                break
        }
    }
    const createElement = (html) => {
        const element = document.createElement("div")
        element.innerHTML = html
        Object.assign(element.style, STYLES)
        return element
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
            dragImageElement = createElement(dragImage ? dragImage : "")

            onDragOverEvent = onDragOver
            onDragEndEvent = onDragEnd
            const removeOverlay = () => {
                const target = DragDropController.dragImageElement
                if(!target)
                    return
                const el = target.querySelector("[data-overlay='-']")
                if (el)
                    target.removeChild(el)

            }
            draggableElement.dragDropListeners = {
                onDrop,
                dragOver: (event) => {
                    const target = DragDropController.dragImageElement
                    if(!target)
                        return
                    if (onDragOverEvent) {
                        const html = onDragOverEvent(DragDropController.dragData, event)
                        removeOverlay(target)
                        if (!html)
                            return

                        target.innerHTML = `<div data-overlay="-">${html}<div data-divider="-"></div></div>${target.innerHTML}`
                        const el = target.querySelector("[data-overlay='-']")
                        Object.assign(el.style, {...STYLES, position: undefined})
                        bBox = target.getBoundingClientRect()
                    }
                },
                removeOverlay
            }
            onDragStartEvent = onDragStart
            this.onMouseMove = onMouseMove

            if (draggable) {
                draggableElement.draggable = true
                draggableElement.addEventListener("dragstart", handler)
                draggableElement.addEventListener("dragend", handler)
                draggableElement.addEventListener("drag", handler)

            }
            draggableElement.addEventListener("drop", handler)
            draggableElement.addEventListener("dragenter", handler)
            draggableElement.addEventListener("dragover", handler)
            draggableElement.addEventListener("dragleave", handler)
        },
        onDestroy: () => {
            draggableElement.removeEventListener("dragstart", handler)
            draggableElement.removeEventListener("dragend", handler)
            draggableElement.removeEventListener("drag", handler)
            draggableElement.removeEventListener("drop", handler)
            draggableElement.removeEventListener("dragleave", handler)
            draggableElement.removeEventListener("dragover", handler)
            draggableElement.removeEventListener("dragenter", handler)
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
            disabled = data
            if (draggableElement)
                draggableElement.draggable = false
        }
    }
}