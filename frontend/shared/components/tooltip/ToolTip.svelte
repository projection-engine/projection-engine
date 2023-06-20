<script>
    import {onDestroy, onMount} from "svelte"
    import ToolTipService from "./ToolTipService"

    let open = false
    export let content = ""
    let wrapper
    let bBox, bodyBBox
    let isMounted
    let targetParent

    const handleMouseMove = (event) => {

    	ToolTipService.getInstance().element.style.left = (event.clientX + 10) + "px"
    	ToolTipService.getInstance().element.style.top = (event.clientY + 10) + "px"

    	let transform = {x: "0px", y: "0px"}
    	if ((event.clientX + 10 + bBox.width) >= bodyBBox.width)
    		transform.x = "calc(-100% - 10px)"
    	if ((event.clientY + 10 + bBox.height) >= bodyBBox.height)
    		transform.y = "calc(-100% - 10px)"
    	ToolTipService.getInstance().element.style.transform = `translate(${transform.x}, ${transform.y})`
    }

    function close() {
    	document.removeEventListener("mousemove", handleMouseMove)
    	open = false
    	ToolTipService.getInstance().element.setAttribute("data-sveltetooltipanimation", "")
    }

    const hover = (event) => {
    	open = true

    	const instance = ToolTipService.getInstance()
    	bBox = instance.element.getBoundingClientRect()
    	bodyBBox = document.body.getBoundingClientRect()

    	instance.element.setAttribute("data-sveltetooltipanimation", "-")
    	instance.element.style.left = (event.clientX + 10) + "px"
    	instance.element.style.top = (event.clientY + 10) + "px"
    	document.addEventListener("mousemove", handleMouseMove)
    	if (targetParent)
    		targetParent.addEventListener(
    			"mouseleave",
    			close,
    			{once: true}
    		)
    }

    $: {
    	const instance = ToolTipService.getInstance()

    	if (open) {
    		instance.portal.open()
    		instance.closeCurrent = () => {
    			close()
    			if (targetParent)
    				targetParent.removeEventListener("mouseleave", close)
    		}
    	} else
    		instance.portal.close()
    }

    $: {
    	if (open)
    		ToolTipService.getInstance().element.innerHTML = content
    }
    onMount(() => {
    	targetParent = wrapper.parentElement
    	if (targetParent)
    		targetParent.addEventListener("mouseenter", hover)
    	isMounted = true
    })
    onDestroy(() => {
    	if (targetParent)
    		targetParent.removeEventListener("mouseenter", hover)
    	close()
    })

</script>

{#if !isMounted}
    <div bind:this={wrapper}>
    </div>
{/if}

