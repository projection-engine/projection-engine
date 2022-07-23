<script>
    import {onDestroy, onMount} from "svelte";
    import Options from "./Options.svelte";
    const RIGHT_BUTTON = 2

    let startPosition = undefined, locked = false
    let contextMenu
    let contextProps = {}
    function checkMouseOffset(startPosition, event) {
        return Math.abs(startPosition.x - event.clientX) < 10 && Math.abs(startPosition.y - event.clientY) < 10
    }

    function setPlacementOffset(target, event) {
        const bBox = target.getBoundingClientRect()
        if (event.clientX + bBox.width > document.body.offsetWidth)
            target.style.left = ((event.clientX - 8) - bBox.width / 2) + "px"
        else
            target.style.left = (event.clientX - 8)+ "px"

        if (event.clientY + bBox.height > document.body.offsetHeight) {
            target.style.top = (event.clientY + 8) - bBox.height + "px"
        } else
            target.style.top = (event.clientY - 8) + "px"
        target.style.zIndex = "999"
    }

    const handleContext = (event) => {
        if (startPosition && !locked && window.contextMenu?.focused) {
            event.preventDefault()
            if (checkMouseOffset(startPosition, event)) {
                const targets = document.elementsFromPoint(event.clientX, event.clientY)
                    .filter(t => {
                        let hasAttribute = false
                        const attributes = Array.from(t.attributes)
                        for (let i = 0; i < attributes.length; i++) {
                            const attr = attributes[i]
                            if (!attr.nodeName.includes("data-"))
                                continue
                            const has = window.contextMenu.focused.triggers.find(f => attr.nodeName === f)
                            if (has)
                                hasAttribute = hasAttribute || has

                        }
                        if (hasAttribute)
                            return t
                    })

                if (targets[0]) {
                    let trigger
                    Array.from(targets[0].attributes).forEach((attr) => {
                        const has = window.contextMenu.focused.triggers.find((f) => attr.nodeName === f)
                        if (has)
                            trigger = has
                    })


                    contextMenu.focus()
                    contextProps = {
                        options:window.contextMenu.focused.options,
                        selected: targets[0],
                        trigger,
                        event,
                        close: () => contextMenu.style.zIndex = "-1",
                        callback:() => setPlacementOffset(contextMenu, event)
                    }
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
                if (!window.contextMenu.targets[elements[i].id])
                    continue
                focused = window.contextMenu.targets[elements[i].id]
            }
            if (focused) {
                startPosition = {x: event.clientX, y: event.clientY}
                window.contextMenu.focused = focused
            }
        }
    }
    onMount(() => {
        document.addEventListener("mousedown", handleMouseDown)
        contextMenu.parentElement.addEventListener("mouseup", handleContext)
        document.onpointerlockchange = () => {
            locked = !!document.pointerLockElement
        }
    })
    onDestroy(() => {
        document.onpointerlockchange = undefined
        document.removeEventListener("mousedown", handleMouseDown)
        contextMenu.parentElement.removeEventListener("mouseup", handleContext)
    })
</script>

<div
    bind:this={contextMenu}
    tabindex="0"
    on:blur={e => {
        if(!e.currentTarget.contains(e.nativeEvent.relatedTarget)) {
            window.contextMenu.focused = undefined
            contextMenu.style.zIndex = "-1"
            startPosition = undefined
        }
    }}
>
    <Options {...contextProps}/>
</div>