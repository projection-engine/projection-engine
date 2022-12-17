<script>
    import {onDestroy, onMount} from "svelte";
    import ContextMenuController from "../../libs/ContextMenuController";


    const {ipcRenderer} = window.require("electron")
    const RIGHT_BUTTON = 2

    let startPosition = undefined
    let contextMenu

    let open = false

    function checkMouseOffset(startPosition, event) {
        return Math.abs(startPosition.x - event.clientX) < 10 && Math.abs(startPosition.y - event.clientY) < 10
    }


    const handleContext = (event) => {
        if(document.pointerLockElement != null)
            return
        if (startPosition &&  ContextMenuController.data.focused) {
            event.preventDefault()
            if (checkMouseOffset(startPosition, event)) {
                let targetElement
                const allowAll = !ContextMenuController.data.focused.triggers || ContextMenuController.data.focused.triggers.length === 0
                if (allowAll)
                    targetElement = event.target
                else {
                    const allElements = document.elementsFromPoint(event.clientX, event.clientY)
                    for (let i = 0; i < allElements.length; i++) {
                        const currentElement = allElements[i]
                        let hasAttribute = false
                        const attributes = Array.from(currentElement.attributes)

                        for (let i = 0; i < attributes.length; i++) {
                            const attr = attributes[i]
                            if (!attr.nodeName.includes("data-"))
                                continue
                            const has = ContextMenuController.data.focused.triggers.find(f => attr.nodeName === f)

                            if (has)
                                hasAttribute = hasAttribute || has
                        }
                        if (hasAttribute) {
                            targetElement = currentElement
                            break;
                        }
                    }
                }

                if (targetElement) {
                    let trigger = allowAll ? targetElement : undefined
                    if (!trigger)
                        Array.from(targetElement.attributes).forEach((attr) => {
                            const has = ContextMenuController.data.focused.triggers.find((f) => attr.nodeName === f)
                            if (has)
                                trigger = has
                        })

                    open = true
                    if(ContextMenuController.data.focused.onFocus)
                        ContextMenuController.data.focused.onFocus(trigger, targetElement, event)
                    ipcRenderer.send("OPEN_CONTEXT_MENU", ContextMenuController.data.focused.id)
                }
            }
            startPosition = undefined
        }
    }

    const handleMouseDown = (event) => {
        if (event.button === RIGHT_BUTTON) {
            const elements = document.elementsFromPoint(event.clientX, event.clientY)
            let focused
            for (let i = 0; i < elements.length; i++) {
                if (!ContextMenuController.data.targets[elements[i].id])
                    continue
                focused = ContextMenuController.data.targets[elements[i].id]
            }
            if (focused) {
                startPosition = {x: event.clientX, y: event.clientY}
                ContextMenuController.data.focused = focused
            }
        } else if (!contextMenu.contains(event.target)) {
            open = false
            contextMenu.style.zIndex = "-1"
        }
    }
    onMount(() => {
        document.addEventListener("mousedown", handleMouseDown)
        contextMenu.parentElement.addEventListener("mouseup", handleContext)
    })
    onDestroy(() => {
        document.onpointerlockchange = undefined
        document.removeEventListener("mousedown", handleMouseDown)
        contextMenu.parentElement.removeEventListener("mouseup", handleContext)
    })

</script>

<div style="display: none" bind:this={contextMenu}></div>
