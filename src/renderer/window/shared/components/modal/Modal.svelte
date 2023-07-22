<script>
    import {onDestroy, onMount} from "svelte"

    import SveltePortal from "../../lib/SveltePortal"

    export let handleClose
    export let styles
    let content

    function handler(event) {
    	if (!content.contains(event.target)) {
    		handleClose()
    		content.style.display = "none"
    		content.style.zIndex = "-1"
    	}
    }

    const portal = new SveltePortal(999)
    onMount(() => {
    	portal.create(content)
    	portal.open()
    	document.addEventListener("mousedown", handler)
    })
    onDestroy(() => {
    	portal.close()
    	document.removeEventListener("mousedown", handler)
    })
</script>

<div class="content" bind:this={content} style={styles}>
    <slot/>
</div>

<style>
    .content {
        padding: 4px 8px;
        position: fixed;
        z-index: 999;

        background: var(--pj-background-tertiary);
        border-radius: 3px;

        box-shadow: var(--pj-boxshadow);

        top: 50%;
        left: 50%;

        transform: translate(-50%, -50%);

        display: grid;
        justify-items: center;
        align-items: center;
    }


</style>