<script>
    import {onDestroy, onMount} from "svelte";
    import SelectionStore from "../../stores/SelectionStore";
    import GIZMOS from "../../static/GIZMOS.ts";
    import UIAPI from "../../../../../engine-core/lib/rendering/UIAPI";
    import SettingsStore from "../../stores/SettingsStore";
    import QueryAPI from "../../../../../engine-core/lib/utils/QueryAPI";
    import Header from "./Header.svelte";
    import EngineStore from "../../stores/EngineStore";

    import LOCALIZATION_EN from "../../static/LOCALIZATION_EN";
    import ToolTip from "../../../../components/tooltip/ToolTip.svelte";
    import HierarchyController from "../hierarchy/lib/HierarchyController";

    const INTERNAL_ID = crypto.randomUUID()

    let engine = {}
    let settings = {}
    let ref
    let tooltip
    let isAlreadyOpen = false

    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)

    const handler = e => {
        if (settings.gizmo === GIZMOS.NONE)
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
                tooltip.style.opacity = "1"
                tooltip.addEventListener("mouseleave", handler, {once: true})
                tooltip.addEventListener("click", handler, {once: true})
                const entity = QueryAPI.getEntityByID(e.target.getAttribute("data-engineentityid"))
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

    onMount(() => {
        if (UIAPI.iframeParent)
            return
        HierarchyController.registerListener(INTERNAL_ID, () => {
            if (UIAPI.uiMountingPoint != null)
                update()
        })
        UIAPI.buildUI(ref)
        update()
    })

    onDestroy(() => {
        HierarchyController.removeListener(INTERNAL_ID)
        if (UIAPI.iframeParent === ref)
            UIAPI.destroyUI()
        unsubscribeSettings()
        unsubscribeEngine()
    })
</script>

<Header engine={engine} settings={settings} isAlreadyOpen={isAlreadyOpen}/>
<div class="wrapper ui" bind:this={ref} style={`opacity: ${isAlreadyOpen ? ".5" : "1"}`}>
    {#if isAlreadyOpen}
        <ToolTip content={LOCALIZATION_EN.UI_ALREADY_OPEN}/>
    {/if}
    <div class="tooltip" id={INTERNAL_ID} bind:this={tooltip}></div>
</div>

<style>
    .tooltip {
        position: fixed;
        background: rgba(0, 149, 255, .5);

        font-size: .8rem;
        font-weight: 500;
        z-index: -1;
        display: grid;
        align-content: center;
        align-items: center;
        justify-content: right;
        padding: 4px;
    }

    .wrapper.ui {

        overflow: hidden;

        width: 100%;
        height: calc(100% - 25px);
        background: var(--pj-background-quaternary) radial-gradient(var(--pj-border-primary) 1px, transparent 0);
        background-size: 20px 20px;
    }
</style>