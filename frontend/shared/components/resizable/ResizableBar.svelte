<script>
    import {onDestroy, onMount} from "svelte"

    export let onResize = undefined
    export let onResizeEnd = undefined
    export let onResizeStart = undefined
    export let type = "width"
    export let disabled = false

    let parentBBox
    let ref
    let resize
    let mutation
    let initial = {}
    let bBox
    let prevBbox

    function updateTarget(element, value) {
    	if (type === "width" && value <= parentBBox.width && value > 0)
    		element.style.width = value + "px"
    	else if (value <= parentBBox.height && value > 0)
    		element.style.height = value + "px"
    }

    const handleMouseMove = (event) => {
    	try {
    		if (onResize)
    			onResize()
    		if (type === "width") {

    			const newW = event.clientX - bBox.left
    			const offset = newW - bBox.width

    			updateTarget(ref.previousElementSibling, event.clientX - bBox.left)
    			updateTarget(ref.nextElementSibling, prevBbox.width - offset)
    		} else {
    			const newH = (event.clientY - bBox.top)
    			const offset = newH - bBox.height

    			updateTarget(ref.previousElementSibling, event.clientY - bBox.top)
    			updateTarget(ref.nextElementSibling, prevBbox.height - offset)
    		}

    	} catch (err) {
    		console.error(err)
    		document.removeEventListener("mousemove", handleMouseMove)
    	}
    }
    const handleMouseUp = () => {
    	try {
    		if (onResizeEnd)
    			onResizeEnd(ref.nextElementSibling, ref.previousElementSibling)

    		ref.parentNode.style.userSelect = "default"
    		document.removeEventListener("mousemove", handleMouseMove)
    	} catch (err) {
    		console.error(err)
    		document.removeEventListener("mousemove", handleMouseMove)
    	}
    }
    const handleMouseDown = (event) => {
    	bBox = ref.previousElementSibling.getBoundingClientRect()
    	prevBbox = ref.nextElementSibling.getBoundingClientRect()
    	parentBBox = ref.parentElement.getBoundingClientRect()
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
    			onResizeStart(false)
    		event.currentTarget.parentNode.style.userSelect = "none"
    		event.currentTarget.style.transition = "none"
    		handleMouseMove(event)
    		document.addEventListener("mousemove", handleMouseMove)
    		document.addEventListener("mouseup", handleMouseUp, {once: true})
    	}
    }


    const callback = () => {
    	try {
    		if (onResizeStart)
    			onResizeStart(true)
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

    onMount(() => {
    	resize = new ResizeObserver(callback)
    	mutation = new MutationObserver(callback)

    	if (!ref.previousElementSibling || !ref.nextElementSibling)
    		return
    	const initialW1 = ref.previousElementSibling.style.width,
    		initialW2 = ref.nextElementSibling.style.width,
    		initialH1 = ref.previousElementSibling.style.height,
    		initialH2 = ref.nextElementSibling.style.height
    	initial = {initialW1, initialW2, initialH1, initialH2}
    	mutation.observe(ref.parentNode, {childList: true})
    	resize.observe(document.body)
    })
    onDestroy(() => {
    	if (ref) {
    		if (ref.previousElementSibling)
    			ref.previousElementSibling.style[type] = "100%"
    		if (ref.nextElementSibling)
    			ref.nextElementSibling.style[type] = "100%"
    	}
    	if (mutation)
    		mutation.disconnect()
    	if (resize)
    		resize.disconnect()
    })

</script>
<div
        on:mousedown={handleMouseDown}
        style={`

            min-height: ${type === "height" ? "2px" : "100%"};
            max-height: ${type === "height" ? "2px" : "100%"};
            min-width: ${type === "width" ? "2px" : "100%"};
            max-width: ${type === "width" ? "2px" : "100%"};
            cursor: ${type === "width" ? "ew-resize" : "ns-resize"};
        `}
        data-sveltedisabled={`${disabled}`}
        class="wrapper"
        bind:this={ref}
></div>

<style>
    .wrapper {
        background: inherit;
        cursor: pointer;
        background: var(--pj-border-primary);
        min-height: 2px;
        min-width: 2px;

    }

    .wrapper:active,
    .wrapper:hover {
        background: var(--pj-border-secondary) !important;
    }

    .wrapper[data-sveltedisabled="true"] {
        background: inherit !important;
        cursor: default !important;
    }
</style>