<script>
    import {onDestroy, onMount} from "svelte";

    import Portal from "../../lib/Portal";

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

    const portal = new Portal(999)
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

        background: var(--pj-background-secondary);
        border: var(--pj-border-primary) 1px solid;
        border-radius: 5px;

        box-shadow: var(--pj-boxshadow);

        top: 50%;
        left: 50%;

        transform: translate(-50%, -50%);

        display: grid;
        justify-content: center;
        justify-items: center;
        align-items: center;
    }


</style>