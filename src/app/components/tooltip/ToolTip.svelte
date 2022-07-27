<script>
    import {onDestroy, onMount} from "svelte";

    let open = false
    export let content = ""
    export let styles = ""
    let wrapper
    let bBox
    const handleMouseMove = (event) => {
        wrapper.style.left = (event.clientX + 10) + "px"
        wrapper.style.top = (event.clientY + 10) + "px"

        let transform = {x: "0px", y: "0px"}
        if ((event.clientX + 10 + bBox.width) > document.body.offsetWidth)
            transform.x = "calc(-100% - 10px)"
        if ((event.clientY + 10 + bBox.height) > document.body.offsetHeight)
            transform.y = "calc(-100% - 10px)"

        wrapper.style.transform = `translate(${transform.x}, ${transform.y})`
    }
    const hover = (event) => {
        open = true
        bBox = wrapper.getBoundingClientRect()
        wrapper.style.left = (event.clientX + 10) + "px"
        wrapper.style.top = (event.clientY + 10) + "px"
        document.addEventListener("mousemove", handleMouseMove)
        wrapper.parentNode.addEventListener(
            "mouseleave",
            () => {
                document.removeEventListener("mousemove", handleMouseMove)
                open = false
            },
            {once: true}
        )
    }

    onMount(() => {
        console.log(wrapper)
        wrapper.parentNode.addEventListener("mouseenter", hover)
    })
    onDestroy(() => {
        wrapper.parentNode.removeEventListener("mouseenter", hover)
    })
</script>


<div style={`display: ${open ? "block" : "none"}; ` + (styles ? styles : "")} class="container" bind:this={wrapper}>
    {#if content}
        {content}
    {:else}
        <slot/>
    {/if}
</div>


<style>
    .container {
        user-select: none;
        height: auto;
        min-height: 15px;
        width: fit-content;
        max-width: 300px;
        opacity: 0;
        animation: show 150ms ease forwards;
        animation-delay: 250ms;
        box-shadow: rgb(0 0 0 / 20%) 0 0 2px 2px;
        position: fixed !important;
        z-index: 9999;

        background: var(--pj-background-quaternary);
        border: var(--pj-border-primary) 1px solid;
        padding: 4px 8px;
        border-radius: 3px;
        color: white !important;
        font-weight: 550;
    }

    @keyframes show {
        0% {
            opacity: 0;
        }

        100% {
            opacity: 1;
        }
    }
</style>