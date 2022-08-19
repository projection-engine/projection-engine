<script>
    import {onDestroy, onMount} from "svelte";
    import UIStoreController from "../../../stores/UIStoreController";
    import UIRenderer from "../../../libs/engine/UIRenderer";

    let store = {}
    const unsubscribe = UIStoreController.getStore(v => store = v)
    let renderTarget
    let lastHovered
    let lastStyle
    const handler = e => {
        switch (e.type) {
            case "click":
                break
            case "mouseout":
                if (lastHovered)
                    lastHovered.style.opacity = lastStyle
                break
            case "mouseover":
                if (lastHovered )
                    lastHovered.style.opacity = lastStyle
                if(lastHovered !== e.target) {
                    lastHovered = e.target
                    lastStyle =e.target.style.opacity
                    e.target.style.opacity = ".5"
                }

                break
            default:
                break
        }
    }
    let ref
    onMount(() => {
        renderTarget = UIRenderer.renderTarget
        renderTarget.addEventListener("click", handler)
        renderTarget.addEventListener("mouseover", handler)
        renderTarget.addEventListener("mouseout", handler)
    })
    onDestroy(() => {
        renderTarget.removeEventListener("click", handler)
        renderTarget.removeEventListener("mouseover", handler)
        renderTarget.removeEventListener("mouseout", handler)
        unsubscribe()
    })
</script>

<span style="display: none" bind:this={ref}></span>