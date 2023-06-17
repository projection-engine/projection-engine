<script>
    import {onDestroy, onMount} from "svelte"

    export let toRender
    export let rowHeight

    let offset = 0
    let maxQuantity = 0

    let ref
    const observer = new ResizeObserver(() => {
    	if (!ref)
    		return
    	maxQuantity = Math.floor(ref.parentElement.getBoundingClientRect().height / rowHeight)
    })

    onMount(() => {
    	ref.parentElement.addEventListener("wheel", ev => {
    		ev.preventDefault()
    		const isIncrement = ev.wheelDelta < 0
    		if (isIncrement && offset < toRender.length * 1.5)
    			offset += 1
    		else if (offset > 0 && !isIncrement)
    			offset -= 1
    		console.log(offset)
    	}, {passive: false})
    	observer.observe(ref.parentElement)
    })
    onDestroy(() => observer.disconnect())
</script>

<span style="display: none" bind:this={ref}></span>
{#each toRender as _, index}
    {#if index <= maxQuantity && toRender[index + offset] !== undefined}
        <slot element={toRender[index + offset]} index={index + offset}/>
    {/if}
{/each}
