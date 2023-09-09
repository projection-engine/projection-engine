<script lang="ts">
    import {onDestroy, onMount} from "svelte"
    import UIManager from "@engine-core/managers/UIManager"
    import Header from "./components/Header.svelte"


    import EntityHierarchyService from "../../services/engine/EntityHierarchyService"
    import GPUState from "@engine-core/states/GPUState"
    import ToastNotificationSystem from "../../../shared/components/alert/ToastNotificationSystem"
    import LocalizationEN from "../../../../../shared/enums/LocalizationEN"
    import EntitySelectionStore from "../../../shared/stores/EntitySelectionStore";
    import type EditorEntity from "../../../../engine/tools/EditorEntity";
    import SerializedState from "../../components/view/SerializedState.svelte";
    import EntityManager from "@engine-core/managers/EntityManager";
    import EditorEntityManager from "../../../../engine/tools/EditorEntityManager";
    import UUIDGen from "../../../../../shared/UUIDGen";

    const COMPONENT_ID = UUIDGen()

    let ref: HTMLElement
    let tooltipRef: HTMLElement
    let isOnSelection = false
    let isAutoUpdateEnabled = true
    let selectedEntity: EditorEntity


    const resizeObserver = new ResizeObserver(() => UIManager.document.style.height = ref.offsetHeight + "px")

    function clickHandler(e: MouseEvent) {
        if (!isOnSelection)
            return
        const tElement = (e.target as HTMLElement)
        const bBox = tElement.getBoundingClientRect()
        const entity = tElement.getAttribute("data-entityid") as EngineEntity

        tooltipRef.style.width = bBox.width + "px"
        tooltipRef.style.height = bBox.height + "px"
        tooltipRef.style.top = bBox.top + "px"
        tooltipRef.style.left = bBox.left + "px"
        tooltipRef.style.zIndex = "500"
        tooltipRef.style.opacity = "1"

        if (e.ctrlKey) {
            EntitySelectionStore.setEntitiesSelected([...EntitySelectionStore.getEntitiesSelected(), tooltipRef.hovered.id])
        }
        else if (EntityManager.entityExists(entity)) {
            EntitySelectionStore.setEntitiesSelected(entity)
            selectedEntity = EditorEntityManager.getEntity(entity)
        }else
            selectedEntity = undefined
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
                await UIManager.updateAllElements()
                ToastNotificationSystem.getInstance().log(LocalizationEN.UPDATING_UI)
            }, 15000)
        }
    }

    onMount(() => {
        resizeObserver.observe(ref)
        UIManager.showUI()

        UIManager.document.style.height = (GPUState.canvas.getBoundingClientRect().height - 28) + "px"
        UIManager.document.style.top = "28px"
        EntityHierarchyService.registerListener(COMPONENT_ID, update)
        update()
    })

    onDestroy(() => {
        clearInterval(updateInterval)
        resizeObserver.disconnect()
        EntityHierarchyService.removeListener(COMPONENT_ID)
        UIManager.hideUI()
        UIManager.document.style.height = "100%"
        UIManager.document.style.top = "0"
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
