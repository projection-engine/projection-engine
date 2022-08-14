<script>
    import {onDestroy, onMount} from "svelte";
    import Options from "./components/Options.svelte";

    const RIGHT_BUTTON = 2

    let startPosition = undefined, locked = false
    let contextMenu
    let contextProps = {}
    let open = false

    function checkMouseOffset(startPosition, event) {
        return Math.abs(startPosition.x - event.clientX) < 10 && Math.abs(startPosition.y - event.clientY) < 10
    }

    function setPlacementOffset(target, event) {
        const bBox = target.getBoundingClientRect()
        if (event.clientX + bBox.width > document.body.offsetWidth)
            target.style.left = ((event.clientX - 8) - bBox.width / 2) + "px"
        else
            target.style.left = (event.clientX - 8) + "px"

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
                let targetElement
                const allElements = document.elementsFromPoint(event.clientX, event.clientY)

                for (let i = 0; i < allElements.length; i++) {
                    const currentElement = allElements[i]
                    let hasAttribute = false
                    const attributes = Array.from(currentElement.attributes)

                    for (let i = 0; i < attributes.length; i++) {
                        const attr = attributes[i]
                        if (!attr.nodeName.includes("data-"))
                            continue
                        const has = window.contextMenu.focused.triggers.find(f => attr.nodeName === f)

                        if (has)
                            hasAttribute = hasAttribute || has

                    }
                    if (hasAttribute) {
                        targetElement = currentElement
                        break;
                    }
                }

                if (targetElement) {
                    let trigger
                    Array.from(targetElement.attributes).forEach((attr) => {
                        const has = window.contextMenu.focused.triggers.find((f) => attr.nodeName === f)
                        if (has)
                            trigger = has
                    })

                    open = true
                    contextProps = {
                        options: window.contextMenu.focused.options,
                        onFocus: window.contextMenu.focused.onFocus,
                        selected: targetElement,
                        trigger,
                        event,
                        close: () => {
                            open = false
                            contextMenu.style.zIndex = "-1"
                        },
                        callback: () => setPlacementOffset(contextMenu, event),
                        open: true
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
        } else if (!contextMenu.contains(event.target)) {
            open = false
            contextMenu.style.zIndex = "-1"
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
        class="wrapper"
        bind:this={contextMenu}
>
    {#if open}
        <Options {...contextProps}/>
    {/if}
</div>

<style>

    .wrapper {
        position: absolute;
        z-index: -1;
        background: var(--pj-background-quaternary-light);
        border: var(--pj-border-primary) 1px solid;
        width: 225px;
        max-height: 300px;
        padding: 2px;
        border-radius: 3px;
        overflow-x: hidden;
        overflow-y: auto;
        box-shadow: var(--pj-boxshadow);
    }

</style>