<script>
    import {onDestroy, onMount} from "svelte";
    import RENDER_TARGET from "../../../../data/RENDER_TARGET";
    import {ConversionAPI, Engine, GPU, PickingAPI,} from "../../../../../../public/engine/production";

    import selectionQueryWorker from "../../utils/selection-query-worker";
    import SelectBox from "../../../../../shared/components/select-box/SelectBox.svelte";
    import CameraBar from "../shared/CameraBar.svelte";

    import GIZMOS from "../../../../data/GIZMOS";
    import onViewportClick from "../../utils/on-viewport-click";
    import Loader from "../../../../libs/loader/Loader";
    import drawIconsToBuffer from "../../utils/draw-icons-to-buffer";
    import GizmoSystem from "../../../../../../public/engine/editor/services/GizmoSystem";
    import dragDrop from "../../../../../shared/components/drag-drop/drag-drop";
    import SelectionStore from "../../../../stores/SelectionStore";
    import viewportContext from "../../../../templates/viewport-context";
    import ContextMenuController from "../../../../../shared/libs/ContextMenuController";
    import Localization from "../../../../../shared/libs/Localization";

    let WORKER = selectionQueryWorker()


    export let settings
    export let translate
    export let engine

    const LEFT_BUTTON = 0
    let mouseDelta = {x: 0, y: 0}


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

    $: isSelectBoxDisabled = settings.gizmo !== GIZMOS.NONE
    const draggable = dragDrop(false)
    $: {
        if (settings?.viewportHotkeys != null)
            ContextMenuController.mount(
                {icon: "public", label: Localization.PROJECT.VIEWPORT.TITLE},
                viewportContext(settings),
                RENDER_TARGET,
                ["data-viewport"]
            )
    }
    onMount(() => {

        const parentElement = gpu.canvas
        parentElement.addEventListener("mousedown", onMouseDown)
        parentElement.addEventListener("mouseup", onMouseUp)

        draggable.onMount({
            targetElement: gpu.canvas,
            onDrop: (data, event) => Loader.load(data, false, event.clientX, event.clientY),
            onDragOver: () => `
                <span data-icon="-" style="font-size: 70px">add</span>
                ${translate("DRAG_DROP")}
            `
        })
    })
    onDestroy(() => {
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

                WORKER.postMessage({entities: Engine.entities, data})
                WORKER.onmessage = ({data: selected}) => SelectionStore.engineSelected = selected
            } catch (err) {
                console.error(err, startCoords, nStart)
            }
        }
    }
</script>

<CameraBar/>
<SelectBox
        targetElementID={RENDER_TARGET}
        disabled={isSelectBoxDisabled}
        setSelected={setSelectionBox}
        target={RENDER_TARGET}
        selected={[]}
        nodes={[]}
/>
