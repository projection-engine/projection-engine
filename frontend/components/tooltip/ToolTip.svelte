<script>
    import {onDestroy, onMount} from "svelte";
    import ToolTipController from "./ToolTipController";

    let open = false
    export let content = ""
    let wrapper
    let bBox, bodyBBox
    let isMounted
    let targetParent

    const handleMouseMove = (event) => {

        ToolTipController.element.style.left = (event.clientX + 10) + "px"
        ToolTipController.element.style.top = (event.clientY + 10) + "px"

        let transform = {x: "0px", y: "0px"}
        if ((event.clientX + 10 + bBox.width) >= bodyBBox.width)
            transform.x = "calc(-100% - 10px)"
        if ((event.clientY + 10 + bBox.height) >= bodyBBox.height)
            transform.y = "calc(-100% - 10px)"
        ToolTipController.element.style.transform = `translate(${transform.x}, ${transform.y})`
    }

    function close() {
        document.removeEventListener("mousemove", handleMouseMove)
        open = false
        ToolTipController.element.classList.remove("tooltip-animation")
    }

    const hover = (event) => {

        open = true

        bBox = ToolTipController.element.getBoundingClientRect()
        bodyBBox = document.body.getBoundingClientRect()

        ToolTipController.element.classList.add("tooltip-animation")
        ToolTipController.element.style.left = (event.clientX + 10) + "px"
        ToolTipController.element.style.top = (event.clientY + 10) + "px"
        document.addEventListener("mousemove", handleMouseMove)
        if (targetParent)
            targetParent.addEventListener(
                "mouseleave",
                close,
                {once: true}
            )
    }

    $: {
        if (open) {
            ToolTipController.portal.open()
            ToolTipController.closeCurrent = () => {
                close()
                if (targetParent)
                    targetParent.removeEventListener("mouseleave", close)
            }
        } else
            ToolTipController.portal.close()
    }

    $: {
        if (open)
            ToolTipController.element.innerHTML = content

    }
    onMount(() => {
        ToolTipController.initialize()
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

