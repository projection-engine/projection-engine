<script>
    import {onDestroy, onMount} from "svelte"
    import SelectionStore from "../../../shared/stores/SelectionStore"
    import UIAPI from "../../../../engine-core/lib/rendering/UIAPI"
    import SettingsStore from "../../../shared/stores/SettingsStore"
    import QueryAPI from "../../../../engine-core/lib/utils/QueryAPI"
    import Header from "./Header.svelte"
    import EngineStore from "../../../shared/stores/EngineStore"


    import HierarchyController from "../../lib/controllers/HierarchyController"
    import GPU from "../../../../engine-core/GPU"
    import AlertController from "../../../shared/components/alert/AlertController"
    import LocalizationEN from "../../../../contants/LocalizationEN"

    const INTERNAL_ID = crypto.randomUUID()

    let engine = {}
    let settings = {}
    let ref
    let tooltip
    let isOnSelection = false
    let updateEnabled = true
    let selectedEntity


    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    const obs = new ResizeObserver(() => {
    	UIAPI.document.style.height = ref.offsetHeight + "px"
    })
    const handler = e => {
    	if (!isOnSelection)
    		return

    	const bBox = e.target.getBoundingClientRect()
    	const entity = QueryAPI.getEntityByID(e.target.getAttribute("data-entityid"))

    	tooltip.style.width = bBox.width + "px"
    	tooltip.style.height = bBox.height + "px"
    	tooltip.style.top = bBox.top + "px"
    	tooltip.style.left = bBox.left + "px"
    	tooltip.style.zIndex = "500"
    	tooltip.style.opacity = "1"

    	if (e.ctrl)
    		SelectionStore.engineSelected = [...SelectionStore.engineSelected, tooltip.hovered.id]
    	else
    		SelectionStore.engineSelected = [entity.id]
    	selectedEntity = entity

    }
    $: {
    	if (!isOnSelection && tooltip)
    		tooltip.style.zIndex = "-1"
    }

    function update() {
    	const targets = document.querySelectorAll("[data-enginewrapper='-']")
    	targets.forEach(t => {
    		t.removeEventListener("click", handler)
    		t.addEventListener("click", handler)
    	})
    }

    let interval
    $: {
    	clearInterval(interval)
    	if (updateEnabled)
    		interval = setInterval(() => {
    			UIAPI.updateAllElements().then(() => {
    				AlertController.log(LocalizationEN.UPDATING_UI)
    			})
    		}, 15000)
    }
    onMount(() => {
    	obs.observe(ref)
    	UIAPI.showUI()

    	UIAPI.document.style.height = (GPU.canvas.getBoundingClientRect().height - 28) + "px"
    	UIAPI.document.style.top = "28px"
    	HierarchyController.registerListener(INTERNAL_ID, update)
    	update()
    })

    onDestroy(() => {
    	clearInterval(interval)
    	obs.disconnect()
    	HierarchyController.removeListener(INTERNAL_ID)
    	UIAPI.hideUI()
    	UIAPI.document.style.height = "100%"
    	UIAPI.document.style.top = "0"
    	unsubscribeSettings()
    	unsubscribeEngine()
    })
</script>

<Header
        selected={selectedEntity}
        isOnSelection={isOnSelection}
        toggleOnSelection={() => isOnSelection = !isOnSelection}
        updateEnabled={updateEnabled}
        toggleAutoUpdate={() => updateEnabled = !updateEnabled}
        engine={engine}
        settings={settings}
/>
<div class="wrapper ui" bind:this={ref}>
    <div class="tooltip" id={INTERNAL_ID} bind:this={tooltip}></div>
</div>

<style>
    .tooltip {
        position: fixed;
        border: var(--pj-accent-color) 2px solid;

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