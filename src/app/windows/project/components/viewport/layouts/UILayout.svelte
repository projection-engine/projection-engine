<script>
    import {onDestroy, onMount} from "svelte";
    import UIStore from "../../../stores/UIStore";
    import UserInterfaceController from "../../../libs/engine/production/controllers/UserInterfaceController";

    let store = {}
    const unsubscribe = UIStore.getStore(v => store = v)
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
        renderTarget = UserInterfaceController.renderTarget
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