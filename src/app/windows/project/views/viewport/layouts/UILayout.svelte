<script>
    import {onDestroy, onMount} from "svelte";
    import UIStoreController from "../../../stores/UIStoreController";
    import UI_RENDER_TARGET from "../../../data/misc/UI_RENDER_TARGET";

    let store = {}
    const unsubscribe = UIStoreController.getStore(v => store = v)
    let renderTarget
    let lastHovered
    let lastOutline
    const handler = e => {
        switch (e.type) {
            case "click":
                break
            case "mouseout":
                if (lastHovered)
                    lastHovered.style.outline = lastOutline
                break
            case "mouseover":
                if (lastHovered )
                    lastHovered.style.outline = lastOutline
                if(lastHovered !== e.target) {
                    lastHovered = e.target
                    lastOutline =e.target.style.outline
                    e.target.style.outline = "yellow 2px solid"
                }

                break
            default:
                break
        }
    }
    let ref
    onMount(() => {
        renderTarget = document.getElementById(UI_RENDER_TARGET)
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