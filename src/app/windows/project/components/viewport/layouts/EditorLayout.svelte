<script>
    import {onDestroy, onMount} from "svelte";
    import RENDER_TARGET from "../../../data/misc/RENDER_TARGET";
    import ConversionAPI from "../../../libs/engine/production/libs/ConversionAPI";
    import PickingAPI from "../../../libs/engine/production/libs/PickingAPI";
    import viewportSelectionBoxWorker from "../../../../../libs/web-workers/viewport-selection-box-worker";
    import SelectBox from "../../../../../components/select-box/SelectBox.svelte";
    import SideOptions from "../components/QuickAccess.svelte";
    import CameraBar from "../components/columns/CameraBar.svelte";
    import GizmoBar from "../components/columns/GizmoBar.svelte";

    import GIZMOS from "../../../data/misc/GIZMOS";
    import onViewportClick from "../utils/on-viewport-click";
    import EngineStore from "../../../stores/EngineStore";
    import Loader from "../../../libs/loader/Loader";
    import drawIconsToBuffer from "../utils/draw-icons-to-buffer";
    import GizmoSystem from "../../../libs/engine/editor/services/GizmoSystem";
    import dragDrop from "../../../../../components/drag-drop";
    import DepthPass from "../../../libs/engine/production/templates/passes/DepthPass";
    import EditorRenderer from "../../../libs/engine/editor/EditorRenderer";
    import TransformationAPI from "../../../libs/engine/production/libs/TransformationAPI";
    import {vec3} from "gl-matrix";
    import InputEventsAPI from "../../../libs/engine/production/libs/InputEventsAPI";
    import SelectionStore from "../../../stores/SelectionStore";

    let WORKER = viewportSelectionBoxWorker()

    export let isReady
    export let settings
    export let translate
    export let engine

    const LEFT_BUTTON = 0
    let mouseDelta = {x: 0, y: 0}
    const CAMERA_DISTANCE = 2

    function transformCursor(e) {


        const t = EditorRenderer.cursor
        mouseDelta.x += e.movementX * CAMERA_DISTANCE
        mouseDelta.y += e.movementY * CAMERA_DISTANCE
        t.translation = ConversionAPI.toWorldCoordinates(mouseDelta.x, mouseDelta.y).slice(0, 3)
        vec3.scale(t.translation, t.translation, 1 / CAMERA_DISTANCE)

        t.transformationMatrix = TransformationAPI.transform(t.translation, [0, 0, 0, 1], t.scaling)
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
        if (!window.renderer)
            return

        mouseDelta = {x: e.clientX, y: e.clientY}
        if (e.button === LEFT_BUTTON && settings.gizmo === GIZMOS.CURSOR && e.target === window.gpu.canvas || e.target === e.currentTarget) {
            InputEventsAPI.lockPointer()

            transformCursor(e)
            document.addEventListener("mousemove", handleMouse)
            document.addEventListener("mouseup", handleMouse, {once: true})
        }
        if (e.button === LEFT_BUTTON && settings.gizmo !== GIZMOS.CURSOR) {

            if (GizmoSystem.targetGizmo) {
                GizmoSystem.targetGizmo.onMouseDown(e)
                e.currentTarget.targetGizmo = GizmoSystem.targetGizmo
                e.currentTarget.addEventListener("mousemove", gizmoMouseMove)
            }
        }
    }

    function onMouseUp(event) {
        if (GizmoSystem.targetGizmo) {
            GizmoSystem.targetGizmo.onMouseUp()
            gpu.canvas.parentElement.removeEventListener("mousemove", gizmoMouseMove)
        }
        if (!window.renderer)
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
                SelectionStore.engineSelected  = data
            })
    }


    $: isSelectBoxDisabled = settings.gizmo !== GIZMOS.NONE


    const draggable = dragDrop(false)

    onMount(() => {
        const parentElement = gpu.canvas.parentElement
        parentElement.addEventListener("mousedown", onMouseDown)
        parentElement.addEventListener("mouseup", onMouseUp)

        draggable.onMount({
            targetElement: parentElement,
            onDrop: data => Loader.load(data),
            onDragOver: () => `
                <span data-icon="-" style="font-size: 70px">add</span>
                ${translate("DRAG_DROP")}
            `
        })
    })
    onDestroy(() => {
        const parentElement = gpu.canvas.parentElement
        parentElement.removeEventListener("mousedown", onMouseDown)
        parentElement.removeEventListener("mouseup", onMouseUp)
    })
    const setSelectionBox = (_, startCoords, endCoords) => {
        if (startCoords && endCoords) {
            drawIconsToBuffer()
            const depthFBO = DepthPass.framebuffer
            const size = {
                w: depthFBO.width,
                h: depthFBO.height
            }
            const nStart = ConversionAPI.toQuadCoord(startCoords, size)
            const nEnd = ConversionAPI.toQuadCoord(endCoords, size)

            try {
                const data = PickingAPI.readBlock(depthFBO, nStart, nEnd)
                WORKER.postMessage({entities: window.renderer.entities, data})
                WORKER.onmessage = ({data: selected}) => EngineStore.updateStore({...engine, selected})
            } catch (err) {
                console.error(err, startCoords, nStart)
            }
        }
    }
</script>


<GizmoBar translate={translate}/>
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
