<script>
    import RENDER_TARGET from "../../static/misc/RENDER_TARGET"
    import GIZMOS from "../../static/misc/GIZMOS"
    import importData from "../../libs/importer/import"
    import updateCursor from "./utils/update-cursor"
    import onViewportClick from "./utils/on-viewport-click"
    import EditorEngine from "../../libs/engine-extension/EditorEngine";
    import windowBuilder from "../../libs/engine/window-builder";
    import Conversion from "../../libs/engine/utils/Conversion";
    import {engine as engineStore} from "../../stores/engine-store";
    import {get} from "svelte/store";
    import {settingsStore} from "../../stores/settings-store";
    import entitySearchWorker from "../../../../web-workers/entity-search-worker";
    import updateRenderer from "./utils/update-renderer";
    import HeaderOptions from "./views/ViewportSettings.svelte";
    import CameraBar from "./components/CameraBar.svelte";
    import INFORMATION_CONTAINER from "../../static/misc/INFORMATION_CONTAINER";
    import EnglishLocalization from "../../../../static/EnglishLocalization";
    import GizmoBar from "./components/GizmoBar.svelte";
    import SideOptions from "./views/SideOptions.svelte";
    import COMPONENTS from "../../libs/engine/data/COMPONENTS";
    import bindShortcuts from "../shortcuts/hooks/bindShortcuts";
    import {onDestroy, onMount} from "svelte";

    export let utils = {}
    const LEFT_BUTTON = 0
    let WORKER = entitySearchWorker()

    const engine = get(engineStore),
        settings = get(settingsStore),
        id = sessionStorage.getItem("electronWindowID")

    let gizmoSystem
    let rendererIsReady = false
    let canvasRef = null
    let hovered = false

    $: {
        if (canvasRef && !engine.viewportInitialized) {
            windowBuilder(canvasRef)
            engineStore.set({...engine, viewportInitialized: true})

            window.renderer = new EditorEngine({w: settings.resolution[0], h: settings.resolution[1]}, () => {
                updateRenderer(
                    engine.viewportInitialized,
                    engine.fallbackMaterial,
                    engine.meshes,
                    engine.materials,
                    engine.entities,
                    engine.cameraInitialized,
                    (v) => engineStore.set({...engine, cameraInitialized: v}),
                    (v) => engineStore.set({...engine, fallbackMaterial: v}),
                    engine.executingAnimation,
                    engine.selected,
                    engine.levelScript,
                    settings
                )
            })

            rendererIsReady = true
        }
    }

    let latestTranslation

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
        onViewportClick(event, settings, engine, (data) => {
            engineStore.set(data)
        })
    }

    const translate = (key) => EnglishLocalization.PROJECT.VIEWPORT[key]
    const shortcutBinding = bindShortcuts({
        focusTargetLabel: translate("TITLE"),
        focusTargetIcon: "window",
        actions: []
    })

    onMount(() => shortcutBinding.onMount(canvasRef))
    onDestroy(() => shortcutBinding.onDestroy(canvasRef))
    $: {
        shortcutBinding.rebind(canvasRef, engine.executingAnimation)
    }

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
        importData(e, engine)
    }}
    class={"viewport"}
    class:hovered={hovered}
>
    {#if !engine.executingAnimation}
        <HeaderOptions translate={translate} settings={settings}/>
    {/if}
    <div class="wrapper">
        <canvas
                bind:this={canvasRef}
                id={RENDER_TARGET}
                style={`width: ${settings.visible.sideBarViewport ? "calc(100% - 23px)" : "100%"}; height: 100%; background: transparent`}
                width={settings.resolution[0]}
                height={settings.resolution[1]}
        ></canvas>
        {#if rendererIsReady && !engine.executingAnimation}
            <GizmoBar translate={translate}/>
            <CameraBar translate={translate}/>
        {/if}
        {#if rendererIsReady && settings.visible.sideBarViewport}
            <SideOptions translate={translate} selectedEntity={engine.selectedEntity}/>
        {/if}
    </div>
    {#if rendererIsReady}
        <div
                id={INFORMATION_CONTAINER.CONTAINER}
                class={"info-container"}
                style={"display:"  + (settings.visible.metricsViewport ? "flex" : "none")}>
            <div id={INFORMATION_CONTAINER.FPS}></div>
            <div id={INFORMATION_CONTAINER.TRANSFORMATION}></div>
        </div>
    {/if}

    <!--    <SelectBox-->
    <!--            targetElementID={RENDER_TARGET}-->
    <!--            disabled={settings.gizmo === GIZMOS.CURSOR}-->
    <!--            setSelected={(_, startCoords, endCoords) => {-->
    <!--            if (startCoords && endCoords) {-->
    <!--                drawIconsToBuffer()-->
    <!--                const depthFBO = renderer.renderingPass.depthPrePass.frameBuffer-->
    <!--                const size = {-->
    <!--                    w: depthFBO.width,-->
    <!--                    h: depthFBO.height-->
    <!--                }-->
    <!--                const nStart = Conversion.toQuadCoord(startCoords, size)-->
    <!--                const nEnd = Conversion.toQuadCoord(endCoords, size)-->

    <!--                try {-->
    <!--                    const data = renderer.picking.readBlock(depthFBO, nStart, nEnd)-->
    <!--                    entityWorker.postMessage({entities: renderer.entities, data})-->
    <!--                    entityWorker.onmessage = ({data: selected}) => engine.setSelected(selected)-->
    <!--                } catch (err) {-->
    <!--                    console.error(err, startCoords, nStart)-->
    <!--                }-->
    <!--            }-->
    <!--        }}-->
    <!--            target={RENDER_TARGET}-->
    <!--            selected={[]}-->
    <!--            nodes={[]}-->
    <!--    />-->
</div>

<style>
    .wrapper {
        display: flex;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

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