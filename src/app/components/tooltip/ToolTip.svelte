<script>
    import {onDestroy, onMount} from "svelte";
    import createPortal from "../create-portal";

    let open = false
    export let content = ""
    let wrapper
    let mountingPoint
    let bBox, bodyBBox
    const portal = createPortal(999, false)
    const handleMouseMove = (event) => {
        wrapper.style.left = (event.clientX + 10) + "px"
        wrapper.style.top = (event.clientY + 10) + "px"

        let transform = {x: "0px", y: "0px"}
        if ((event.clientX + 10 + bBox.width) >= bodyBBox.width)
            transform.x = "calc(-100% - 10px)"
        if ((event.clientY + 10 + bBox.height) >= bodyBBox.height)
            transform.y = "calc(-100% - 10px)"
        wrapper.style.transform = `translate(${transform.x}, ${transform.y})`
    }
    const hover = (event) => {
        open = true
        bBox = wrapper.getBoundingClientRect()
        bodyBBox = document.body.getBoundingClientRect()
        wrapper.style.left = (event.clientX + 10) + "px"
        wrapper.style.top = (event.clientY + 10) + "px"
        document.addEventListener("mousemove", handleMouseMove)
        portal.parentElement.addEventListener(
            "mouseleave",
            () => {
                document.removeEventListener("mousemove", handleMouseMove)
                open = false
            },
            {once: true}
        )
    }

    $: open ? portal.open() : portal.close()
    onMount(() => {
        portal.create(wrapper)
        portal.parentElement.addEventListener("mouseenter", hover)
    })
    onDestroy(() => {
        try{
            portal.parentElement.removeEventListener("mouseenter", hover)
            portal.destroy()
        }catch(err){
            console.log(err)
        }
    })
</script>


<div class="container" bind:this={wrapper}>
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
        box-shadow: rgb(0 0 0 / 20%) 2px 2px 2px 2px;
        position: fixed;
        z-index: 9999;

        background: var(--pj-background-quaternary);
        border: var(--pj-border-primary) 1px solid;
        padding: 4px 8px;
        border-radius: 5px;
        color: white !important;
        font-weight: 550;

        font-size: .8rem;
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