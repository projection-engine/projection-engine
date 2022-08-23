<script>
    import {onDestroy, onMount} from "svelte";
    import RENDER_TARGET from "../../../data/misc/RENDER_TARGET";
    import Conversion from "../../../libs/engine/production/services/Conversion";
    import ViewportPicker from "../../../libs/engine/production/services/ViewportPicker";
    import viewportSelectionBoxWorker from "../../../../../libs/web-workers/viewport-selection-box-worker";
    import SelectBox from "../../../../../components/select-box/SelectBox.svelte";
    import SideOptions from "../components/QuickAccess.svelte";
    import CameraBar from "../components/columns/CameraBar.svelte";
    import GizmoBar from "../components/columns/GizmoBar.svelte";
    import updateCursor from "../utils/update-cursor";
    import GIZMOS from "../../../data/misc/GIZMOS";
    import onViewportClick from "../utils/on-viewport-click";
    import RendererStoreController from "../../../stores/RendererStoreController";
    import Loader from "../../../libs/loader/Loader";
    import drawIconsToBuffer from "../utils/draw-icons-to-buffer";
    import LoopAPI from "../../../libs/engine/production/libs/apis/LoopAPI";
    import GizmoSystem from "../../../libs/engine/editor/services/GizmoSystem";

    let WORKER = viewportSelectionBoxWorker()

    export let isReady
    export let settings
    export let translate
    export let engine

    let gizmoSystem
    let latestTranslation
    const LEFT_BUTTON = 0

    function handleMouse(e) {
        if (e.type === "mousemove") {
            latestTranslation = Conversion.toScreen(e.clientX, e.clientY).slice(0, 3)
            updateCursor(latestTranslation)
        } else
            document.removeEventListener("mousemove", handleMouse)
    }

    function gizmoMouseMove(event) {
        if (GizmoSystem.targetGizmo)
            GizmoSystem.targetGizmo.onMouseMove(event)
    }

    function onMouseDown(e) {
        if (!window.renderer)
            return
        e.currentTarget.startedCoords = {x: e.clientX, y: e.clientY}
        if (e.button === LEFT_BUTTON && settings.gizmo === GIZMOS.CURSOR && e.target === window.gpu.canvas || e.target === e.currentTarget) {
            latestTranslation = Conversion.toScreen(e.clientX, e.clientY).slice(0, 3)
            updateCursor(latestTranslation)
            document.addEventListener("mousemove", handleMouse)
            document.addEventListener("mouseup", handleMouse, {once: true})
        }
        if (e.button === LEFT_BUTTON && settings.gizmo !== GIZMOS.CURSOR) {
            gizmoSystem = window.renderer.editorSystem.gizmoSystem
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
            event.currentTarget.removeEventListener("mousemove", gizmoMouseMove)
        }
        if (!window.renderer)
            return
        onViewportClick(
            event,
            settings,
            engine,
            (data) => {
                RendererStoreController.updateEngine({...engine, selected: data})
            })
    }


    $: isSelectBoxDisabled = settings.gizmo !== GIZMOS.NONE

    async function dragHandler(e) {
        e.preventDefault()
        if (e.type === "drop") {
            await Loader.load(e)
        }
    }

    onMount(() => {
        const parentElement = gpu.canvas.parentElement
        parentElement.addEventListener("mousedown", onMouseDown)
        parentElement.addEventListener("mouseup", onMouseUp)
        parentElement.addEventListener("dragover", dragHandler)
        parentElement.addEventListener("dragleave", dragHandler)
        parentElement.addEventListener("drop", dragHandler)
    })
    onDestroy(() => {
        const parentElement = gpu.canvas.parentElement
        parentElement.removeEventListener("mousedown", onMouseDown)
        parentElement.removeEventListener("mouseup", onMouseUp)
        parentElement.removeEventListener("dragover", dragHandler)
        parentElement.removeEventListener("dragleave", dragHandler)
        parentElement.removeEventListener("drop", dragHandler)
    })

</script>


<GizmoBar translate={translate}/>
<CameraBar translate={translate}/>
{#if settings.visible.sideBarViewport}
    <SideOptions translate={translate} selectedEntity={engine.selectedEntity}/>
{/if}
<SelectBox
        targetElementID={RENDER_TARGET}
        disabled={isSelectBoxDisabled}
        setSelected={(_, startCoords, endCoords) => {
                    if (startCoords && endCoords) {
                        drawIconsToBuffer()
                        const depthFBO = LoopAPI.renderMap.get("depthPrePass").frameBuffer
                        const size = {
                            w: depthFBO.width,
                            h: depthFBO.height
                        }
                        const nStart = Conversion.toQuadCoord(startCoords, size)
                        const nEnd = Conversion.toQuadCoord(endCoords, size)

                        try {
                            const data = ViewportPicker.readBlock(depthFBO, nStart, nEnd)
                            WORKER.postMessage({entities: window.renderer.entities, data})
                            WORKER.onmessage = ({data: selected}) => RendererStoreController.updateEngine({...engine, selected })
                        } catch (err) {
                            console.error(err, startCoords, nStart)
                        }
                    }
                }}
        target={RENDER_TARGET}
        selected={[]}
        nodes={[]}
/>
