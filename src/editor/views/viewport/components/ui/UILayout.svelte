<script>
    import {onDestroy, onMount} from "svelte";
    import EntityAPI from "../../../../../../public/engine/production/apis/EntityAPI";
    import {Engine} from "../../../../../../public/engine/production";
    import EngineStore from "../../../../stores/EngineStore";
    import SelectionStore from "../../../../stores/SelectionStore";
    import GIZMOS from "../../../../data/GIZMOS";
    import bindContextTarget from "../../../../../shared/components/context-menu/libs/bind-context-target";
    import RENDER_TARGET from "../../../../data/RENDER_TARGET";
    import getContextMenu from "../../utils/get-context-menu";
    import getUIContextMenu from "../../utils/get-UI-context-menu";
    import UIAPI from "../../../../../../public/engine/production/apis/UIAPI";
    import SettingsStore from "../../../../stores/SettingsStore";
    import {v4} from "uuid";

    export let engine
    export let settings
    $: isOnSelection = settings.gizmo === GIZMOS.NONE
    let ref
    let tooltip
    const INTERNAL_ID = v4()

    const handler = e => {
        if (!isOnSelection)
            return
        switch (e.type) {
            case "click":
                if (tooltip.hovered)
                    if (e.ctrl)
                        SelectionStore.engineSelected = [...SelectionStore.engineSelected, tooltip.hovered.id]
                    else
                        SelectionStore.engineSelected = [tooltip.hovered.id]
                tooltip.style.zIndex = "-1"
                SettingsStore.updateStore({...settings, gizmo: GIZMOS.TRANSLATION})
                break
            case "mouseleave":
                tooltip.style.zIndex = "-1"
                break
            case "mouseenter":
                const bBox = e.target.getBoundingClientRect()
                const iframeBBox = ref.firstChild.getBoundingClientRect()
                tooltip.style.width = bBox.width + "px"
                tooltip.style.height = bBox.height + "px"
                tooltip.style.top = (bBox.top + iframeBBox.top) + "px"
                tooltip.style.left = (bBox.left + iframeBBox.left) + "px"
                tooltip.style.zIndex = "500"
                tooltip.addEventListener("mouseleave", handler, {once: true})
                tooltip.addEventListener("click", handler, {once: true})
                const entity = Engine.entitiesMap.get(e.target.getAttribute("data-engineentityid"))
                tooltip.innerHTML = `<div style="backdrop-filter: blur(10px) brightness(70%); padding: 8px; border-radius: 3px;">${entity.name}</div>`
                tooltip.hovered = entity
                break
            default:
                break
        }
    }

    function update() {
        const targets = UIAPI.document.querySelectorAll("[data-enginewrapper='-']")
        targets.forEach(t => {
            t.removeEventListener("mouseenter", handler)
            t.addEventListener("mouseenter", handler)
        })
    }

    $: {
        if (UIAPI.uiMountingPoint != null && engine.changeID)
            update()
    }

    onMount(() => {
        UIAPI.buildUI(ref)
        update()
    })
</script>

<div class="tooltip" id={INTERNAL_ID} bind:this={tooltip}></div>
<div class="wrapper ui" bind:this={ref} ></div>

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

    .wrapper.ui {

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