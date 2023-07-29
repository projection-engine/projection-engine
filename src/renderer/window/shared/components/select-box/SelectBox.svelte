<script lang="ts">
    import {onDestroy} from "svelte"

    const MIN_BOX_SIZE = 50, LEFT_BUTTON = 0
    export let targetElementID
    export let disabled
    export let setSelected
    export let getSelected
    export let nodes
    export let targetElement
    export let returnRefs
    let ref


    const handleMouseMove = (event) => {
    	if(!ref || !ref.parentElement)
    		return
    	if (!document.pointerLockElement) {
    		if (ref.parentElement) {
    			const bBox = ref.parentElement.getBoundingClientRect()
    			const offset = {
    				x: bBox.left - ref.parentElement.scrollLeft,
    				y: bBox.top - ref.parentElement.scrollTop
    			}

    			let translation = {x: 0, y: 0}
    			if (!ref.dragInitialized) {
    				ref.style.top = (ref.startingPosition.y - offset.y) + "px"
    				ref.style.left = (ref.startingPosition.x - offset.x) + "px"
    				ref.style.zIndex = 999

    				ref.dragInitialized = true
    			}

    			ref.style.left = (event.clientX - offset.x) + "px"
    			ref.style.top = (event.clientY - offset.y) + "px"

    			if (ref.startingPosition.x - event.clientX < 0) {
    				ref.style.width = (event.clientX - ref.startingPosition.x) + "px"
    				translation.x = (ref.startingPosition.x - event.clientX)
    			} else {
    				ref.style.width = (ref.startingPosition.x - event.clientX) + "px"
    				translation.x = 0
    			}
    			if (ref.startingPosition.y - event.clientY < 0) {
    				ref.style.height = (event.clientY - ref.startingPosition.y) + "px"
    				translation.y = (ref.startingPosition.y - event.clientY)
    			} else {
    				ref.style.height = (ref.startingPosition.y - event.clientY) + "px"
    				translation.y = 0
    			}

    			ref.style.transform = `translate(${translation.x + "px"}, ${translation.y + "px"})`
    		}
    	} else
    		document.removeEventListener("mousemove", handleMouseMove)
    }

    function checkFocus(target:HTMLElement) {
    	if (ref)
    		return  target.tagName !== "INPUT" && target.tagName !== "BUTTON"
    	return false
    }

    const handleMouseDown = (event:MouseEvent) => {
    	const target = <HTMLElement>event.target
    	if (event.button === LEFT_BUTTON && checkFocus(target)) {
    		if (!event.ctrlKey)
    			setSelected([])
    		ref.startingPosition = {x: event.clientX, y: event.clientY}
    		document.addEventListener("mousemove", handleMouseMove)
    		document.addEventListener("mouseup", ({clientY, clientX}) => {
    			ref.dragInitialized = false
    			ref.startingPosition = {x: 0, y: 0}
    			const start = {x: event.clientX, y: event.clientY}, end = {x: clientX, y: clientY}
    			const deltaX = Math.abs(start.x - end.x)
    			const deltaY = Math.abs(start.y - end.y)
    			if (ref && deltaX > MIN_BOX_SIZE && deltaY > MIN_BOX_SIZE) {
    				const bBox = ref.getBoundingClientRect()
    				let currentBox = {
    					x1: bBox.x,
    					y1: bBox.y,
    					x2: bBox.x + bBox.width,
    					y2: bBox.y + bBox.height
    				}
    				let toSelect = [],
    					elements = Array.from(ref.parentElement.querySelectorAll("[data-svelteid]")).map(e => ({
    						id: e.getAttribute("data-svelteid"),
    						element: e
    					}))

    				for (let index = 0; index < nodes.length; index++) {
    					const node = nodes[index]
    					const elBox = elements.find(e => e.id === node.id)?.element?.getBoundingClientRect?.()

    					if (!elBox)
    						continue
    					if (elBox.x > currentBox.x1 && elBox.y > currentBox.y1 && elBox.x < currentBox.x2 && elBox.y < currentBox.y2)
    						toSelect.push(returnRefs ? node : node.id)

    				}
    				if (!event.ctrlKey)
    					setSelected(toSelect, start, end)
    				else
    					setSelected([...getSelected(), ...toSelect], start, end)
    			}
    			ref.style.height = "0px"
    			ref.style.width = "0px"
    			ref.style.zIndex = -1
    			document.removeEventListener("mousemove", handleMouseMove)
    		}, {once: true})
    	}
    }
    let initialized = false
    let lastDisabled = disabled
    $: {
    	if (lastDisabled !== disabled) {
    		lastDisabled = disabled
    		initialized = false
    	}
    }
    $: {
    	if (ref || targetElement) {
    		const el = targetElement ? targetElement : ref.parentElement
    		if (disabled)
    			el.removeEventListener("mousedown", handleMouseDown)
    		if (!initialized && !disabled) {
    			initialized = true
    			el.addEventListener("mousedown", handleMouseDown)
    		}
    	}
    }
    onDestroy(() => {
    	const el = targetElement ? targetElement : ref?.parentElement
    	if(el)
    		el.removeEventListener("mousedown", handleMouseDown)
    })
</script>

<div style="z-index: -1" bind:this={ref} class="box"></div>

<style>
    .box {
        border: gray 1px dashed;
        border-radius: 3px;
        position: absolute;
        z-index: 999;
    }

    .box::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgb(128 128 128 / 50%);
    }
</style>
