<script>
    import GIZMOS from "../../static/misc/GIZMOS"
    import importData from "../../libs/importer/import"
    import updateCursor from "./utils/update-cursor"
    import onViewportClick from "./utils/on-viewport-click"
    import Conversion from "../../libs/engine/services/Conversion";
    import entitySearchWorker from "../../../../web-workers/entity-search-worker";
    import ViewportSettings from "./views/ViewportSettings.svelte";
    import CameraBar from "./components/CameraBar.svelte";
    import INFORMATION_CONTAINER from "../../static/misc/INFORMATION_CONTAINER";
    import Localization from "../../../../libs/Localization";
    import GizmoBar from "./components/GizmoBar.svelte";
    import SideOptions from "./views/SideOptions.svelte";
    import COMPONENTS from "../../libs/engine/data/COMPONENTS";
    import DataStoreController from "../../stores/DataStoreController";
    import {onDestroy} from "svelte";
    import SelectBox from "../../../../components/select-box/SelectBox.svelte";
    import RENDER_TARGET from "../../static/misc/RENDER_TARGET";
    import drawIconsToBuffer from "./utils/draw-icons-to-buffer";
    import EngineLoop from "../../libs/engine/libs/loop/EngineLoop";
    import ViewportPicker from "../../libs/engine/services/ViewportPicker";

    export let isReady = false

    const LEFT_BUTTON = 0
    let WORKER = entitySearchWorker()
    let gizmoSystem
    let hovered = false
    let latestTranslation

    let engine = {}
    let settings = {}
    const unsubscribeEngine = DataStoreController.getEngine(v => engine = v)
    const unsubscribeSettings = DataStoreController.getSettings(v => settings = v)
    onDestroy(() => {
        unsubscribeEngine()
        unsubscribeSettings()
    })

    const id = sessionStorage.getItem("electronWindowID")

    function handleMouse(e) {
        if (e.type === "mousemove") {
            latestTranslation = Conversion.toScreen(e.clientX, e.clientY, renderer.camera).slice(0, 3)
            updateCursor(latestTranslation)
        } else
            document.removeEventListener("mousemove", handleMouse)
    }

    function gizmoMouseMove(event) {
        if (gizmoSystem && gizmoSystem.targetGizmo)
            gizmoSystem.targetGizmo.onMouseMove(event)
    }

    function onMouseDown(e) {
        if (!window.renderer)
            return
        e.currentTarget.startedCoords = {x: e.clientX, y: e.clientY}
        if (e.button === LEFT_BUTTON && settings.gizmo === GIZMOS.CURSOR && e.target === window.gpu.canvas || e.target === e.currentTarget) {
            latestTranslation = Conversion.toScreen(e.clientX, e.clientY, renderer.camera, renderer.cursor.components[COMPONENTS.TRANSFORM].translation).slice(0, 3)
            updateCursor(latestTranslation)
            document.addEventListener("mousemove", handleMouse)
            document.addEventListener("mouseup", handleMouse, {once: true})
        }
        if (e.button === LEFT_BUTTON && settings.gizmo !== GIZMOS.CURSOR) {
            gizmoSystem = window.renderer.editorSystem.gizmoSystem
            if (gizmoSystem.targetGizmo) {
                gizmoSystem.targetGizmo.onMouseDown(e)
                e.currentTarget.targetGizmo = gizmoSystem.targetGizmo
                e.currentTarget.addEventListener("mousemove", gizmoMouseMove)
            }
        }
    }

    function onMouseUp(event) {
        if (gizmoSystem && gizmoSystem.targetGizmo) {
            gizmoSystem.targetGizmo.onMouseUp()
            event.currentTarget.removeEventListener("mousemove", gizmoMouseMove)
        }
    }

    function onClick(event) {
        if (!window.renderer)
            return
        onViewportClick(
            event,
            settings,
            engine,
            (data) => {
                DataStoreController.updateEngine({...engine, selected: data})
            })
    }

    const translate = (key) => Localization.PROJECT.VIEWPORT[key]
    $: {
        if (isReady)
            EngineLoop.miscMap.get("metrics").renderTarget = document.getElementById(INFORMATION_CONTAINER.FPS)
    }
    $: isSelectBoxDisabled = settings.gizmo === GIZMOS.CURSOR
</script>


<div
        on:mousedown={onMouseDown}
        on:mouseup={onMouseUp}
        on:click={onClick}
        on:dragover={e => {
            e.preventDefault()
            hovered  = true
        }}
            on:dragleave={e => {
            e.preventDefault()
            hovered  = false
        }}
        on:drop={e => {
            e.preventDefault()
            hovered  = false
            importData(e)
        }}
        class={"viewport"}
        class:hovered={hovered}
>

    {#if !engine.executingAnimation}
        <ViewportSettings translate={translate} settings={settings}/>
    {/if}
    <div class="wrapper">
        <slot name="canvas"/>
        {#if !engine.executingAnimation}
            {#if isReady }
                <GizmoBar translate={translate}/>
                <CameraBar translate={translate}/>
            {/if}
            {#if isReady && settings.visible.sideBarViewport}
                <SideOptions translate={translate} selectedEntity={engine.selectedEntity}/>
            {/if}
        {/if}
    </div>

    <div
            id={INFORMATION_CONTAINER.CONTAINER}
            class={"info-container"}
            style={"display:"  + (settings.visible.metricsViewport ? "flex" : "none")}>
        <div id={INFORMATION_CONTAINER.FPS}></div>
        <div id={INFORMATION_CONTAINER.TRANSFORMATION}></div>
    </div>

    {#if !engine.executingAnimation}
        <SelectBox
                targetElementID={RENDER_TARGET}
                disabled={isSelectBoxDisabled}
                setSelected={(_, startCoords, endCoords) => {
            if (startCoords && endCoords) {
                drawIconsToBuffer()
                const depthFBO = EngineLoop.renderMap.get("depthPrePass").frameBuffer
                const size = {
                    w: depthFBO.width,
                    h: depthFBO.height
                }
                const nStart = Conversion.toQuadCoord(startCoords, size)
                const nEnd = Conversion.toQuadCoord(endCoords, size)

                try {
                    const data = ViewportPicker.readBlock(depthFBO, nStart, nEnd)
                    WORKER.postMessage({entities: window.renderer.entities, data})
                    WORKER.onmessage = ({data: selected}) => DataStoreController.updateEngine({...engine, selected })
                } catch (err) {
                    console.error(err, startCoords, nStart)
                }
            }
        }}
                target={RENDER_TARGET}
                selected={[]}
                nodes={[]}
        />
    {/if}
</div>

<style>
    .viewport {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: var(--pj-background-tertiary);
        border-radius: 5px;
        position: relative;
        display: flex;
        flex-direction: column;
    }

    .wrapper {
        display: flex;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }


    .info-container {
        height: 23px;
        font-size: .7rem;
        display: flex;
        gap: 4px;
        justify-content: space-between;
        align-items: center;
        padding: 0 4px;
        background: var(--pj-background-tertiary);
        color: var(--pj-color-secondary);
    }

    .info-container > * {
        display: flex;
        gap: 4px;
        justify-content: flex-start;
        align-items: center;
    }
</style>