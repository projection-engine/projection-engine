<script>
    import {onDestroy} from "svelte";

    export let resetTargets = {}
    export let onResize = () => null
    export let onResizeEnd = () => null
    export let onResizeStart = () => null
    export let type = "width"
    export let disabled = false
    export let color = "var(--pj-border-primary)"
    let ref
    let initial

    const handleMouseMove = (event) => {
        if (onResize)
            onResize()
        try {
            const bBox = ref.previousSibling.getBoundingClientRect()
            const prevBbox = ref.nextSibling.getBoundingClientRect()
            if (type === "width") {
                const newW = (event.clientX - bBox.left)
                const offset = newW - bBox.width
                ref.previousSibling.style.width = (event.clientX - bBox.left) + "px"
                ref.nextSibling.style.width = (prevBbox.width - offset) + "px"
            } else {
                const newH = (event.clientY - bBox.top)
                const offset = newH - bBox.height
                ref.previousSibling.style.height = (event.clientY - bBox.top) + "px"
                ref.nextSibling.style.height = (prevBbox.height - offset) + "px"
            }

        } catch (err) {
            console.error(err)
            document.removeEventListener("mousemove", handleMouseMove)
        }
    }
    const handleMouseUp = () => {
        try {
            if (onResizeEnd !== undefined) {
                onResizeEnd(ref.nextSibling, ref.previousSibling)
            }
            ref.parentNode.style.userSelect = "default"
            document.removeEventListener("mousemove", handleMouseMove)
        } catch (err) {
            console.error(err)
            document.removeEventListener("mousemove", handleMouseMove)
        }
    }
    const handleMouseDown = (event) => {

        if (!disabled) {
            const siblings = Array.from(event.currentTarget.parentNode.children)
            const t = type === "width" ? "width" : "height"
            const next = event.currentTarget.nextSibling
            const prev = event.currentTarget.previousSibling
            siblings.forEach(s => {
                if (s !== prev && s !== next)
                    s.style[t] = s.getBoundingClientRect()[t] + "px"
            })
            if (onResizeStart)
                onResizeStart()
            event.currentTarget.parentNode.style.userSelect = "none"
            event.currentTarget.style.transition = "none"
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp, {once: true})
        }
    }


    const callback = () => {
        try {
            if (type === "width") {
                ref.previousSibling.style.width = initial.initialW1
                ref.nextSibling.style.width = initial.initialW2
            } else {
                ref.previousSibling.style.height = initial.initialH1
                ref.nextSibling.style.height = initial.initialH2
            }
        } catch (err) {
            console.error(err)
        }
    }

    $: () => {
        const resize = new ResizeObserver(callback)
        const mutation = new MutationObserver(callback)

        if (ref.previousSibling) {
            const initialW1 = ref.previousSibling.style.width,
                initialW2 = ref.nextSibling.style.width,
                initialH1 = ref.previousSibling.style.height,
                initialH2 = ref.nextSibling.style.height
            initial.current = {initialW1, initialW2, initialH1, initialH2}
            mutation.observe(ref.parentNode, {childList: true})
            resize.observe(document.body)
        }

        if (type === "width") {
            if (resetTargets?.previous)
                ref.previousSibling.style.width = initial.current.initialW1
            if (resetTargets?.next)
                ref.nextSibling.style.width = initial.current.initialW2
        } else {
            if (resetTargets?.previous)
                ref.previousSibling.style.height = initial.current.initialH1
            if (resetTargets?.next)
                ref.nextSibling.style.height = initial.current.initialH2
        }
        return () => {
            mutation.disconnect()
            resize.disconnect()
        }
    }
    onDestroy(() => {
        if (ref.previousSibling)
            ref.previousSibling.style[type] = "100%"
        if (ref.nextSibling)
            ref.nextSibling.style[type] = "100%"
    })

</script>
<div
    on:mousedown={handleMouseDown}
    style={`
        background: ${color};
        minHeight: ${type === "height" ? "3px" : "100%"};
        maxHeight: ${type === "height" ? "3px" : "100%"};
        minWidth: ${type === "width" ? "3px" : "100%"};
        maxWidth: ${type === "width" ? "3px" : "100%"};
        cursor: ${type === "width" ? "ew-resize" : "ns-resize"};
    `}
    data-disabled={`${disabled}`}
    class={"wrapper"}
    bind:this={ref}
></div>

<style>
    .wrapper {
        background: inherit;
        cursor: pointer;
        border-radius: 5px;
        transition: background-color 150ms linear;
        min-height: 3px;
        min-width: 3px;
    }

    .wrapper:active,
    .wrapper:hover {
        background: var(--pj-border-secondary) !important;
    }

    .wrapper[data-disabled="true"] {
        background: inherit !important;
        cursor: default !important;
    }
</style>