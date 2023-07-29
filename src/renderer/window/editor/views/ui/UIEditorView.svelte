<script lang="ts">
    import {onDestroy, onMount} from "svelte"
    import UIAPI from "../../../../engine/core/lib/rendering/UIAPI"
    import QueryAPI from "../../../../engine/core/lib/utils/QueryAPI"
    import Header from "./components/Header.svelte"


    import EntityHierarchyService from "../../services/engine/EntityHierarchyService"
    import GPU from "../../../../engine/core/GPU"
    import ToastNotificationSystem from "../../../shared/components/alert/ToastNotificationSystem"
    import LocalizationEN from "../../../../../shared/enums/LocalizationEN"
    import EntitySelectionStore from "../../../shared/stores/EntitySelectionStore";
    import type Entity from "../../../../engine/core/instances/Entity";
    import SerializedState from "../../components/view/SerializedState.svelte";

    const COMPONENT_ID = crypto.randomUUID()

    let ref: HTMLElement
    let tooltipRef: HTMLElement
    let isOnSelection = false
    let isAutoUpdateEnabled = true
    let selectedEntity: Entity


    const resizeObserver = new ResizeObserver(() => UIAPI.document.style.height = ref.offsetHeight + "px")

    function clickHandler(e) {
        if (!isOnSelection)
            return

        const bBox = e.target.getBoundingClientRect()
        const entity = QueryAPI.getEntityByID(e.target.getAttribute("data-entityid"))

        tooltipRef.style.width = bBox.width + "px"
        tooltipRef.style.height = bBox.height + "px"
        tooltipRef.style.top = bBox.top + "px"
        tooltipRef.style.left = bBox.left + "px"
        tooltipRef.style.zIndex = "500"
        tooltipRef.style.opacity = "1"

        if (e.ctrl)
            EntitySelectionStore.setEntitiesSelected([...EntitySelectionStore.getEntitiesSelected(), tooltipRef.hovered.id])
        else
            EntitySelectionStore.setEntitiesSelected(entity.id)
        selectedEntity = entity
    }

    $: if (!isOnSelection && tooltipRef) tooltipRef.style.zIndex = "-1"

    function update() {
        const targets = document.querySelectorAll("[data-enginewrapper='-']")
        for (let i = 0; i < targets.length; i++) {
            const t = targets[i]
            t.removeEventListener("click", clickHandler)
            t.addEventListener("click", clickHandler)
        }
    }

    let updateInterval
    $: {
        clearInterval(updateInterval)
        if (isAutoUpdateEnabled) {
            updateInterval = setInterval(async () => {
                await UIAPI.updateAllElements()
                ToastNotificationSystem.getInstance().log(LocalizationEN.UPDATING_UI)
            }, 15000)
        }
    }

    onMount(() => {
        resizeObserver.observe(ref)
        UIAPI.showUI()

        UIAPI.document.style.height = (GPU.canvas.getBoundingClientRect().height - 28) + "px"
        UIAPI.document.style.top = "28px"
        EntityHierarchyService.registerListener(COMPONENT_ID, update)
        update()
    })

    onDestroy(() => {
        clearInterval(updateInterval)
        resizeObserver.disconnect()
        EntityHierarchyService.removeListener(COMPONENT_ID)
        UIAPI.hideUI()
        UIAPI.document.style.height = "100%"
        UIAPI.document.style.top = "0"
    })
</script>

<SerializedState
        state={{isOnSelection, isAutoUpdateEnabled, selectedEntity}}
        onStateInitialize={ state => {
            isOnSelection = state.isOnSelection
            isAutoUpdateEnabled = state.isAutoUpdateEnabled
            selectedEntity = state.selectedEntity
        }}
/>
<Header
        selected={selectedEntity}
        isOnSelection={isOnSelection}
        toggleOnSelection={() => isOnSelection = !isOnSelection}
        isAutoUpdateEnabled={isAutoUpdateEnabled}
        toggleAutoUpdate={() => isAutoUpdateEnabled = !isAutoUpdateEnabled}
/>
<div class="wrapper ui" bind:this={ref}>
    <div class="tooltip" id={COMPONENT_ID} bind:this={tooltipRef}></div>
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
