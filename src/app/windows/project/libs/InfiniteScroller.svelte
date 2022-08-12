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
    let target
    const updateSize = () => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            const bBox = target.getBoundingClientRect()
            maxDepth = Math.ceil(bBox.height / branchSize)
            setMaxDepth(maxDepth)
        }, DELAY)
    }

    const observer = new ResizeObserver(() => updateSize())
    const handleWheel = (e) => {
        e.preventDefault()
        const current = offset - Math.sign(e.wheelDelta)
        if (current >= 0 && target.elementsQuantity >= maxDepth && (current < offset || offset <= target.elementsQuantity - maxDepth / 2)) {
            setOffset(current)
            offset = current
        }
    }
    onMount(() => {
        target = ref.parentElement
        updateSize()
        observer.observe(target)
        target.addEventListener("wheel", handleWheel, {passive: false})
    })

    onDestroy(() => {
        observer.disconnect()
        target.removeEventListener("wheel", handleWheel, {passive: false})
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
</script>

<div style="display: none" bind:this={ref}></div>