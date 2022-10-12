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
        draggableElement, onDragEndEvent


    const handler = (event) => {
        switch (event.type) {
            case "dragleave":
                if (!draggableElement.contains(event.relatedTarget))
                    DragDropController.onLeave()
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
                if (draggableElement.isDisabled) {
                    event.preventDefault()
                    return
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
            case "dragend":
                event.preventDefault()
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
                if (!target)
                    return
                const el = target.querySelector("[data-overlay='-']")
                if (el)
                    target.removeChild(el)

            }
            draggableElement.dragDropListeners = {
                onDrop,
                dragOver: (event) => {
                    const target = DragDropController.dragImageElement
                    if (!target)
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
            draggableElement.addEventListener("dragleave", handler)
        },
        onDestroy: () => {
            draggableElement.removeEventListener("dragstart", handler)
            draggableElement.removeEventListener("dragend", handler)
            draggableElement.removeEventListener("drag", handler)
            draggableElement.removeEventListener("dragleave", handler)

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