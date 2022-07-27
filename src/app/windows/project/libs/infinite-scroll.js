const BRANCH_SIZE = 23, DELAY = 500

export default function infiniteScroll(setMaxDepth, setOffset) {
    let timeout
    const updateSize = () => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            const bBox = ref.getBoundingClientRect()
            const quantity = Math.ceil(bBox.height / BRANCH_SIZE)
            setMaxDepth(quantity)
        }, DELAY)
    }
    let ref, observer = new ResizeObserver(() => updateSize())
    const handleWheel = (e) => {
        e.preventDefault()
        const current = parseInt(ref.getAttribute("data-offset")) - Math.sign(e.wheelDelta)
        if (current >= 0)
            setOffset(current)
    }
    return {
        onMount(target) {
            ref = target
            updateSize()
            observer.observe(ref)
            ref.addEventListener("wheel", handleWheel, {passive: false})
        },
        onDestroy() {
            observer.disconnect()
            ref.removeEventListener("wheel", handleWheel, {passive: false})
        }
    }
}