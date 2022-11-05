<script>
    import {onDestroy, onMount} from "svelte";
    import RENDER_TARGET from "../../data/RENDER_TARGET";
    import selectionQueryWorker from "../viewport/utils/selection-query-worker";
    import SelectBox from "../../components/select-box/SelectBox.svelte";
    import CameraGizmo from "../../components/CameraGizmo.svelte";
    import GIZMOS from "../../data/GIZMOS";
    import onViewportClick from "../viewport/utils/on-viewport-click";
    import Loader from "../../libs/loader/Loader";
    import drawIconsToBuffer from "../viewport/utils/draw-icons-to-buffer";
    import GizmoSystem from "../../../public/engine/editor-environment/services/GizmoSystem";
    import dragDrop from "../../components/drag-drop/drag-drop";
    import SelectionStore from "../../stores/SelectionStore";
    import viewportContext from "../../templates/viewport-context";
    import ContextMenuController from "shared-resources/frontend/libs/ContextMenuController";
    import Localization from "../../templates/LOCALIZATION_EN";
    import GizmoBar from "./components/GeneralSettings.svelte";
    import Header from "./Header.svelte";
    import EngineStore from "../../stores/EngineStore";
    import SettingsStore from "../../stores/SettingsStore";

    import GizmoToolTip from "./components/GizmoToolTip.svelte";
    import Metrics from "../../components/Metrics.svelte";
    import CameraTracker from "../../../public/engine/editor-environment/libs/CameraTracker";
    import PickingAPI from "../../../public/engine/api/utils/PickingAPI";
    import ConversionAPI from "../../../public/engine/api/math/ConversionAPI";
    import Engine from "../../../public/engine/Engine";
    import GPU from "../../../public/engine/GPU";
    import EntityStateController from "../../libs/EntityStateController";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte"
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte"

    const WORKER = selectionQueryWorker()

    let mouseDelta = {x: 0, y: 0}

    let engine = {}
    let settings = {}

    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    const LEFT_BUTTON = 0

    $: isSelectBoxDisabled = settings.gizmo !== GIZMOS.NONE
    $: {
        if (settings?.viewportHotkeys != null)
            ContextMenuController.mount(
                {icon: "public", label: Localization.VIEWPORT},
                viewportContext(settings),
                RENDER_TARGET,
                ["data-viewport"]
            )
    }

    function gizmoMouseMove(event) {
        if (GizmoSystem.targetGizmo)
            GizmoSystem.targetGizmo.onMouseMove(event)
    }

    function onMouseDown(e) {
        if (!Engine.isReady || e.button !== LEFT_BUTTON)
            return
        mouseDelta = {x: e.clientX, y: e.clientY}
        if (GizmoSystem.targetGizmo) {
            GizmoSystem.targetGizmo.onMouseDown(e)
            e.currentTarget.targetGizmo = GizmoSystem.targetGizmo
            document.addEventListener("mousemove", gizmoMouseMove)
        }
    }

    function onMouseUp(event) {
        if (GizmoSystem.targetGizmo) {
            GizmoSystem.targetGizmo.onMouseUp()
            document.removeEventListener("mousemove", gizmoMouseMove)
        }
        if (!Engine.isReady)
            return
        onViewportClick(
            event,
            mouseDelta,
            settings,
            (data) => {
                if (GizmoSystem.wasOnGizmo) {
                    GizmoSystem.wasOnGizmo = false
                    return
                }
                SelectionStore.engineSelected = data
            })
    }


    const draggable = dragDrop(false)

    onMount(() => {
        Engine.start()
        CameraTracker.startTracking()
        const parentElement = gpu.canvas
        parentElement.addEventListener("mousedown", onMouseDown)
        parentElement.addEventListener("mouseup", onMouseUp)
        draggable.onMount({
            targetElement: gpu.canvas,
            onDrop: (data, event) => {
                Loader.load(data, false, event.clientX, event.clientY).catch()
            },
            onDragOver: () => `
                <span data-icon="-" style="font-size: 70px">add</span>
                ${Localization.DRAG_DROP}
            `
        })
    })

    onDestroy(() => {
        unsubscribeEngine()
        unsubscribeSettings()
        ContextMenuController.destroy(RENDER_TARGET)
        draggable.onDestroy()
        const parentElement = gpu.canvas
        parentElement.removeEventListener("mousedown", onMouseDown)
        parentElement.removeEventListener("mouseup", onMouseUp)
    })

    const setSelectionBox = (_, startCoords, endCoords) => {
        if (startCoords && endCoords) {
            drawIconsToBuffer()
            const nStart = ConversionAPI.toQuadCoord(startCoords, GPU.internalResolution)
            const nEnd = ConversionAPI.toQuadCoord(endCoords, GPU.internalResolution)

            try {
                const data = PickingAPI.readBlock(nStart, nEnd)

                WORKER.postMessage({entities: Engine.entities.map(e => ({id: e.id, pick: e.pickID})), data})
                WORKER.onmessage = ({data: selected}) => SelectionStore.engineSelected = selected
            } catch (err) {
                console.error(err, startCoords, nStart)
            }
        }
    }
    $: isOnPlay = engine.executingAnimation
</script>

{#if !isOnPlay}
    <GizmoToolTip/>
    {#if settings.showMetrics}
        <Metrics/>
    {/if}

    <Header settings={settings} engine={engine}/>

    <SelectBox
            targetElement={gpu.canvas}
            allowAll={true}
            targetElementID={RENDER_TARGET}
            disabled={isSelectBoxDisabled}
            setSelected={setSelectionBox}
            selected={[]}
            nodes={[]}
    />
    <div class="top-bar">
        <GizmoBar settings={settings}/>
        <CameraGizmo/>
    </div>
{:else}
    <button
            class="stop-button"
            on:click={() => EntityStateController.stopPlayState()}
    >
        <Icon styles="font-size: .85rem">pause</Icon>
        <ToolTip content={Localization.STOP}/>
    </button>
{/if}


<style>
    .stop-button {
        position: absolute;
        top: 4px;
        left: 4px;
        height: 35px;
        width: 35px;
        background: var(--pj-background-primary);

        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
    }

    .top-bar {
        position: absolute;
        padding: 2px;

        z-index: 10;
        top: 28px;
        width: 100%;
        left: 0;

        display: flex;
        justify-content: space-between;
        align-items: flex-start;

    }
</style>