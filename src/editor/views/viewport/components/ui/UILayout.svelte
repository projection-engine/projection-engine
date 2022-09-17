<script>
    import {onDestroy, onMount} from "svelte";
    import BundlerAPI from "../../../../../../public/engine/production/apis/BundlerAPI";
    import {Engine} from "../../../../../../public/engine/production";
    import EngineStore from "../../../../stores/EngineStore";
    import SelectionStore from "../../../../stores/SelectionStore";
    import GIZMOS from "../../../../data/GIZMOS";
    import bindContextTarget from "../../../../../shared/components/context-menu/libs/bind-context-target";
    import RENDER_TARGET from "../../../../data/RENDER_TARGET";
    import getContextMenu from "../../utils/get-context-menu";
    import getUIContextMenu from "../../utils/get-UI-context-menu";

    export let engine
    export let settings
    $: isOnSelection = settings.gizmo === GIZMOS.NONE
    let ref
    let tooltip
    let bBox

    const handler = e => {
        if(!isOnSelection) {
            e.preventDefault()
            return
        }
        switch (e.type) {
            case "click":
                console.log("HERE")
                if (tooltip.hovered)
                    if (e.ctrl)
                        SelectionStore.engineSelected = [...SelectionStore.engineSelected, tooltip.hovered.id]
                    else
                        SelectionStore.engineSelected = [tooltip.hovered.id]
                tooltip.style.zIndex = "-1"
                break
            case "mouseleave":
                tooltip.style.zIndex = "-1"
                break
            case "mouseenter":

                bBox = e.target.getBoundingClientRect()
                tooltip.style.width = bBox.width + "px"
                tooltip.style.height = bBox.height + "px"
                tooltip.style.top = bBox.top + "px"
                tooltip.style.left = bBox.left + "px"
                tooltip.style.zIndex = "999"
                tooltip.addEventListener("mouseleave", handler, {once: true})
                tooltip.addEventListener("click", handler, {once: true})
                const entity = Engine.entitiesMap.get(e.target.getAttribute("data-engineentityid"))
                tooltip.innerHTML = `
                    <div style="backdrop-filter: blur(10px) brightness(70%); padding: 8px; border-radius: 3px;">
                        ${entity.name}
                    </div>
                `
                tooltip.hovered = entity
                break
            default:
                break
        }
    }

    function update() {
        contextMenuBinding.rebind(getUIContextMenu())
        const targets = document.querySelectorAll("[data-enginewrapper='-']")
        targets.forEach(t => {
            t.removeEventListener("mouseenter", handler)
            t.addEventListener("mouseenter", handler)
        })
    }

    $: {
        if (BundlerAPI.uiMountingPoint != null && engine.changeID)
            update()
    }

    const contextMenuBinding = bindContextTarget(RENDER_TARGET,  ["data-viewport"])
    onMount(() => {
        if (!BundlerAPI.uiMountingPoint)
            BundlerAPI.buildUI(ref)
        update()
    })
    onDestroy(() => {
        BundlerAPI.destroyUI()
        contextMenuBinding.onDestroy()
    })

</script>

<div class="tooltip" bind:this={tooltip}></div>
<span class="wrapper" bind:this={ref}></span>

<style>
    .tooltip {
        position: fixed;
        background: rgba(0, 149, 255, .5);

        font-size: .8rem;
        font-weight: 550;
        z-index: -1;
        display: grid;
        align-content: center;
        align-items: center;
        justify-content: right;
        padding: 4px;
    }

    .wrapper {
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--pj-background-tertiary) radial-gradient(var(--pj-border-primary) 1px, transparent 0);
        background-size: 20px 20px;
    }
</style>