<script>
    import {onDestroy, onMount} from "svelte";

    export let resetTargets = {}
    export let onResize = () => null
    export let onResizeEnd = () => null
    export let onResizeStart = () => null
    export let type = "width"
    export let disabled = false
    export let color = "unset"
    let ref
    let initial = {}

    const handleMouseMove = (event) => {
        if (onResize)
            onResize()
        try {
            const bBox = ref.previousElementSibling.getBoundingClientRect()
            const prevBbox = ref.nextElementSibling.getBoundingClientRect()
            if (type === "width") {
                const newW = (event.clientX - bBox.left)
                const offset = newW - bBox.width
                ref.previousElementSibling.style.width = (event.clientX - bBox.left) + "px"
                ref.nextElementSibling.style.width = (prevBbox.width - offset) + "px"
            } else {
                const newH = (event.clientY - bBox.top)
                const offset = newH - bBox.height
                ref.previousElementSibling.style.height = (event.clientY - bBox.top) + "px"
                ref.nextElementSibling.style.height = (prevBbox.height - offset) + "px"
            }

        } catch (err) {
            console.error(err)
            document.removeEventListener("mousemove", handleMouseMove)
        }
    }
    const handleMouseUp = () => {
        try {
            if (onResizeEnd !== undefined) {
                onResizeEnd(ref.nextElementSibling, ref.previousElementSibling)
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
            const siblings = Array.from(event.currentTarget.parentElement.children)
            const t = type === "width" ? "width" : "height"
            const next = event.currentTarget.nextElementSibling
            const prev = event.currentTarget.previousElementSibling
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
                ref.previousElementSibling.style.width = initial.initialW1
                ref.nextElementSibling.style.width = initial.initialW2
            } else {
                ref.previousElementSibling.style.height = initial.initialH1
                ref.nextElementSibling.style.height = initial.initialH2
            }
        } catch (err) {
            console.error(err)
        }
    }
    let resize, mutation
    onMount(() => {
        const resize = new ResizeObserver(callback)
        const mutation = new MutationObserver(callback)

        if (!ref.previousElementSibling || !ref.nextElementSibling)
            return
        const initialW1 = ref.previousElementSibling.style.width,
            initialW2 = ref.nextElementSibling.style.width,
            initialH1 = ref.previousElementSibling.style.height,
            initialH2 = ref.nextElementSibling.style.height
        initial = {initialW1, initialW2, initialH1, initialH2}
        mutation.observe(ref.parentNode, {childList: true})
        resize.observe(document.body)

        if (type === "width") {
            if (resetTargets?.previous )
                ref.previousElementSibling.style.width = initial.initialW1
            if (resetTargets?.next)
                ref.nextElementSibling.style.width = initial.initialW2
        } else {
            if (resetTargets?.previous )
                ref.previousElementSibling.style.height = initial.initialH1
            if (resetTargets?.next )
                ref.nextElementSibling.style.height = initial.initialH2
        }

    })
    onDestroy(() => {
        if (ref.previousElementSibling)
            ref.previousElementSibling.style[type] = "100%"
        if (ref.nextElementSibling)
            ref.nextElementSibling.style[type] = "100%"
        return () => {
            mutation.disconnect()
            resize.disconnect()
        }
    })

</script>
<div
        on:mousedown={handleMouseDown}
        style={`
        background: ${color};
        min-height: ${type === "height" ? "3px" : "100%"};
        max-height: ${type === "height" ? "3px" : "100%"};
        min-width: ${type === "width" ? "3px" : "100%"};
        max-width: ${type === "width" ? "3px" : "100%"};
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