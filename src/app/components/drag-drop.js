class Drag {
    static tooltip
    static dragData
    static onDragTarget
}

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
    let isDragging, mouseEvent, bBox, dragImageElement, noTargetTransformation, onDragStartEvent, onDragOverEvent, draggableElement,
        disabled, onDragEndEvent
    const findElements = (event) => {
        const elements = document.elementsFromPoint(event.clientX, event.clientY)
        let toReturn
        for (let i = 0; i < elements.length; i++) {
            const attr = elements[i].dragDropListeners
            if (attr != null) {
                toReturn = elements[i]
                break
            }
        }
        return toReturn
    }
    const scale = (increment) => {
        const targetBBox = draggableElement.getBoundingClientRect()

        if (!increment) {
            draggableElement.style.transform = "scale(1)"
            draggableElement.style.opacity = "1"
        } else {
            const percentage = increment / targetBBox.width
            draggableElement.style.opacity = ".5"
            draggableElement.style.transform = `scale(${1 + percentage})`
        }
    }
    let timeout, initialClick = {x: 0, y: 0}, clickTimeout
    const handler = (event) => {
        if (disabled)
            return;
        switch (event.type) {
            case "mousemove":
                if (!isDragging && (Math.abs(initialClick.x - event.clientX) >= 10 || Math.abs(initialClick.y - event.clientY) >= 10)) {
                    if(!noTargetTransformation)
                    scale(10)
                    isDragging = true
                    Drag.dragData = onDragStartEvent(mouseEvent)

                    if (dragImageElement) {
                        document.body.appendChild(dragImageElement)
                        bBox = dragImageElement.getBoundingClientRect()
                    }
                }
                if (!isDragging)
                    return
                clearTimeout(timeout)
                timeout = setTimeout(() => {
                    const target = findElements(event)
                    if (!target)
                        return

                    target.style.opacity = .5
                    Drag.tooltip = target
                    target.dragDropListeners.dragOver(dragImageElement, event)

                    target.addEventListener(
                        "mouseout",
                        () => {
                            target.dragDropListeners.removeOverlay(dragImageElement)
                            if (Drag.tooltip)
                                Drag.tooltip.style.opacity = 1
                        },
                        {once: true}
                    )
                }, 50)

                if (dragImageElement.innerHTML)
                    Object.assign(
                        dragImageElement.style,
                        {
                            left: (event.clientX + 10) + "px",
                            top: (event.clientY + 10 - bBox.height / 2) + "px"
                        }
                    )
                if (this.onMouseMove)
                    this.onMouseMove(event, draggableElement, Drag.dragData)
                break
            case "mousedown":
                if (disabled)
                    return;
                initialClick.x = event.clientX
                initialClick.y = event.clientY
                mouseEvent = event

                document.addEventListener("mouseup", handler, {once: true})
                clickTimeout = setTimeout(() => {
                    Drag.onDragTarget = draggableElement
                    document.addEventListener("mousemove", handler)
                }, 250)

                break
            case "mouseup":
                clearTimeout(clickTimeout)
                document.removeEventListener("mousemove", handler)
                clearTimeout(timeout)
                mouseEvent = undefined
                if (Drag.tooltip) {
                    Drag.tooltip.style.opacity = 1
                    Drag.tooltip.dragDropListeners.removeOverlay(dragImageElement)
                    Drag.tooltip = undefined
                }
                if (isDragging) {
                    if (onDragEndEvent)
                        onDragEndEvent()
                    isDragging = false
                    scale()
                    const target = findElements(event)
                    if (target != null && target !== Drag.onDragTarget)
                        target.dragDropListeners.onDrop(Drag.dragData, event)
                    Drag.dragData = undefined
                    if (dragImageElement) {
                        try {
                            document.body.removeChild(dragImageElement)
                        } catch (err) {
                            console.error(err)
                        }
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
        onMount: ({noTransformation, targetElement, onDragStart, onDrop, onMouseMove, dragImage, onDragOver, onDragEnd}) => {
            draggableElement = targetElement
            noTargetTransformation= noTransformation
            dragImageElement = createElement(dragImage ? dragImage : "")

            onDragOverEvent = onDragOver
            onDragEndEvent = onDragEnd
            const removeOverlay = (target) => {
                const el = target.querySelector("[data-overlay='-']")
                if (el)
                    target.removeChild(el)

            }
            draggableElement.dragDropListeners = {
                onDrop,
                dragOver: (target, event) => {
                    if (onDragOverEvent) {
                        const html = onDragOverEvent(Drag.dragData, event)
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

            if (draggable)
                draggableElement.addEventListener("mousedown", handler)
        },
        onDestroy: () => {
            if (!draggable)
                return
            document.removeEventListener("mousemove", handler)
            draggableElement.removeEventListener("mousedown", handler)
            document.removeEventListener("mouseup", handler)
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
        }
    }
}