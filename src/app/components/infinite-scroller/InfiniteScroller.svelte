<script>
    import {onDestroy, onMount} from "svelte";

    export let setMaxDepth
    export let setOffset
    export let branchSize = 23
    export let data = []

    const DELAY = 500
    let timeout
    let maxDepth
    let offset = 0
    let ref
    let bar
    let target
    let isOnDrag = false

    const updateSize = () => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            const bBox = target.getBoundingClientRect()
            maxDepth = Math.ceil(bBox.height / branchSize)
            setMaxDepth(maxDepth)
        }, DELAY)
    }

    const observer = new ResizeObserver(() => updateSize())
    const handler = (e) => {
        switch (e.type) {
            case "wheel": {
                e.preventDefault()
                const current = offset - Math.sign(e.wheelDelta)
                if (current >= 0 && target.elementsQuantity >= maxDepth && (current < offset || offset <= target.elementsQuantity - maxDepth / 2)) {
                    setOffset(current)
                    offset = current
                }
                break
            }
            case "mouseenter":
                if (data.length > maxDepth)
                    ref.style.display = "block"
                break
            case "mouseleave":
                if (isOnDrag)
                    return
                ref.style.display = "none"
                break
            default:
                break
        }
    }
    let incremented = 0
    $: sizePercentage = (offset / (data.length - maxDepth))

    const barHandler = (e) => {
        switch (e.type) {
            case "mousedown":
                isOnDrag = true
                bar.requestPointerLock()
                document.body.addEventListener("mousemove", barHandler)
                break
            case "mouseup":
                isOnDrag = false
                document.exitPointerLock()
                document.body.removeEventListener("mousemove", barHandler)
                break
            case "mousemove": {
                incremented += e.movementY
                if (Math.abs(incremented) >= branchSize/3) {
                    if (sizePercentage > 1 &&  Math.sign(incremented) >= 1 || sizePercentage < 0)
                        return
                    const current = offset + Math.sign(incremented)

                    if (current >= 0 && target.elementsQuantity >= maxDepth && (current < offset || offset <= target.elementsQuantity - maxDepth / 2)) {
                        setOffset(current)
                        offset = current
                    }
                    incremented = 0
                }
                break
            }
            default:
                break
        }
    }
    onMount(() => {
        target = ref.parentElement
        updateSize()
        observer.observe(target)
        target.addEventListener("wheel", handler, {passive: false})
        target.addEventListener("mouseenter", handler)
        target.addEventListener("mouseleave", handler)
        document.body.addEventListener("mouseup", barHandler)
    })

    onDestroy(() => {
        observer.disconnect()
        target.removeEventListener("wheel", handler, {passive: false})
        target.removeEventListener("mouseenter", handler)
        target.removeEventListener("mouseleave", handler)
        document.body.removeEventListener("mouseup", barHandler)
    })

    $: {
        if (target) {
            if (data.length < maxDepth && offset > 1) {
                offset = 0
                setOffset(0)
            }
            target.elementsQuantity = data.length
        }
    }
    $: height =(100 - (data.length - maxDepth))/(maxDepth + 1) + "%"
</script>

<div class="track" bind:this={ref}>
    <div
            class="bar" on:mousedown={barHandler}
            bind:this={bar}
            style={`min-height: 10%; height: ${height}; top: ${ sizePercentage* 100  }%;`}
    ></div>
</div>

<style>
    .track {
        display: none;
        position: absolute;
        right: 0;

        height: 100%;
        width: 6px;
        border: var(--pj-border-primary) 1px solid;
        border-radius: 3px;
        background: var(--pj-background-tertiary);
        z-index: 999;
        overflow: hidden;
    }

    .bar {
        transform: translateY(-50%);
        position: absolute;
        width: 100%;
        background: var(--pj-border-primary);
    }

    .bar:active {
        background: var(--pj-border-secondary);
    }
</style>