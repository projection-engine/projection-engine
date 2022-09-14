<script>
    import {onDestroy, onMount} from "svelte";
    import RENDER_TARGET from "../../../data/RENDER_TARGET";
    import {
        ConversionAPI,
        DepthPass,
        Engine,
        GPU,
        InputEventsAPI,
        PickingAPI,
        TransformationAPI,
    } from "../../../../../public/engine/production";

    import viewportSelectionBoxWorker from "../utils/viewport-selection-box-worker";
    import SelectBox from "../../../../shared/components/select-box/SelectBox.svelte";
    import SideOptions from "./QuickAccess.svelte";
    import CameraBar from "./CameraBar.svelte";

    import GIZMOS from "../../../data/GIZMOS";
    import onViewportClick from "../utils/on-viewport-click";
    import Loader from "../../../libs/loader/Loader";
    import drawIconsToBuffer from "../utils/draw-icons-to-buffer";
    import GizmoSystem from "../../../../../public/engine/editor/services/GizmoSystem";
    import dragDrop from "../../../../shared/components/drag-drop/drag-drop";
    import {vec3} from "gl-matrix";
    import SelectionStore from "../../../stores/SelectionStore";
    import ScreenSpaceGizmo from "../../../../../public/engine/editor/libs/ScreenSpaceGizmo";
    import CameraAPI from "../../../../../public/engine/production/apis/camera/CameraAPI";

    let WORKER = viewportSelectionBoxWorker()


    export let settings
    export let translate
    export let engine

    const LEFT_BUTTON = 0
    let mouseDelta = {x: 0, y: 0}

    function transformCursor(e) {
        const translation = ScreenSpaceGizmo.onMouseMove(e, .1)
        const t = window.engineCursor
        vec3.add(t.translation, t.translation, translation)
        t.matrix = TransformationAPI.transform(t.translation, [0, 0, 0, 1], t.scaling)
    }

    function handleMouse(e) {
        if (e.type === "mousemove") {
            transformCursor(e)

        } else {
            document.removeEventListener("mousemove", handleMouse)
            document.exitPointerLock()
        }
    }

    function gizmoMouseMove(event) {
        if (GizmoSystem.targetGizmo)
            GizmoSystem.targetGizmo.onMouseMove(event)
    }

    function onMouseDown(e) {
        if (!Engine.isReady || e.button !== LEFT_BUTTON)
            return

        mouseDelta = {x: e.clientX, y: e.clientY}
        if (settings.gizmo === GIZMOS.CURSOR) {
            ScreenSpaceGizmo.cameraDistance = Math.max(vec3.length(vec3.sub([], window.engineCursor.translation, CameraAPI.position)), 50)
            const b = gpu.canvas.getBoundingClientRect()
            ScreenSpaceGizmo.mouseDelta.x = b.width / 2
            ScreenSpaceGizmo.mouseDelta.y = b.height / 2
            InputEventsAPI.lockPointer()

            transformCursor(e)
            document.addEventListener("mousemove", handleMouse)
            document.addEventListener("mouseup", handleMouse, {once: true})
            return
        }
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
                console.trace(GizmoSystem.wasOnGizmo, data, "IM HERE")
                if (GizmoSystem.wasOnGizmo) {
                    GizmoSystem.wasOnGizmo = false
                    return
                }
                SelectionStore.engineSelected = data
            })
    }


    $: isSelectBoxDisabled = settings.gizmo !== GIZMOS.NONE

    const draggable = dragDrop(false)
    onMount(() => {
        const parentElement = gpu.canvas
        parentElement.addEventListener("mousedown", onMouseDown)
        parentElement.addEventListener("mouseup", onMouseUp)

        draggable.onMount({
            targetElement: gpu.canvas,
            onDrop: (data, event) => Loader.load(data, false, event.clientX, event.clientY),
            onDragOver: () => {

                return `
                    <span data-icon="-" style="font-size: 70px">add</span>
                    ${translate("DRAG_DROP")}
                `
            }
        })
    })
    onDestroy(() => {
        draggable.onDestroy()
        const parentElement = gpu.canvas.parentElement
        parentElement.removeEventListener("mousedown", onMouseDown)
        parentElement.removeEventListener("mouseup", onMouseUp)
    })
    const setSelectionBox = (_, startCoords, endCoords) => {
        if (startCoords && endCoords) {
            drawIconsToBuffer()
            const depthFBO = DepthPass.framebuffer
            const nStart = ConversionAPI.toQuadCoord(startCoords, GPU.internalResolution)
            const nEnd = ConversionAPI.toQuadCoord(endCoords, GPU.internalResolution)

            try {
                const data = PickingAPI.readBlock(depthFBO, nStart, nEnd)
                WORKER.postMessage({entities: Engine.entities, data})
                WORKER.onmessage = ({data: selected}) => SelectionStore.engineSelected = selected
            } catch (err) {
                console.error(err, startCoords, nStart)
            }
        }
    }
</script>


<CameraBar translate={translate}/>
{#if settings.visible.sideBarViewport}
    <SideOptions translate={translate}/>
{/if}
<SelectBox
        targetElementID={RENDER_TARGET}
        disabled={isSelectBoxDisabled}
        setSelected={setSelectionBox}
        target={RENDER_TARGET}
        selected={[]}
        nodes={[]}
/>
