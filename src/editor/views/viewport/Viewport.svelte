<script>
    import Header from "./components/Header.svelte";
    import Localization from "../../../shared/libs/Localization";
    import EngineStore from "../../stores/EngineStore";
    import {onDestroy, onMount} from "svelte";
    import VIEWPORT_TABS from "../../data/VIEWPORT_TABS";
    import EditorLayout from "./components/editor/EditorLayout.svelte";
    import UILayout from "./components/ui/UILayout.svelte";
    import SettingsStore from "../../stores/SettingsStore";
    import GizmoToolTip from "./components/editor/GizmoToolTip.svelte";
    import {Engine} from "../../../../public/engine/production";
    import {CameraTracker} from "../../../../public/engine/editor";
    import EditorHeader from "./components/editor/EditorHeader.svelte";
    import UIEditorHeader from "./components/ui/UIEditorHeader.svelte";
    import HotKeysController from "../../../shared/libs/HotKeysController";

    import FilesStore from "../../stores/FilesStore";

    import TerrainHeader from "./components/terrain/TerrainHeader.svelte";
    import TerrainLayout from "./components/terrain/TerrainLayout.svelte";
    import viewportHotkeys from "../../templates/viewport-hotkeys";
    import RENDER_TARGET from "../../data/RENDER_TARGET";
    import Metrics from "./components/Metrics.svelte";

    export let updateView
    export let viewTab = VIEWPORT_TABS.EDITOR

    let canvasRef
    let engine = {}
    let settings = {}
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)

    let ref

    $:isReady = engine.isReady
    $: {
        if (ref != null) {
            HotKeysController.bindAction(
                ref,
                Object.values(viewportHotkeys(settings)),
                "public",
                Localization.PROJECT.VIEWPORT.TITLE
            )
        }
    }
    onMount(() => {
        CameraTracker.stopTracking()
        canvasRef.replaceWith(document.getElementById(RENDER_TARGET + "VIEWPORT").firstElementChild)
        CameraTracker.startTracking()
    })

    onDestroy(() => {
        HotKeysController.unbindAction(ref)
        unsubscribeEngine()
        unsubscribeSettings()
    })

    const translate = (key) => Localization.PROJECT.VIEWPORT[key]
    $: if (engine.executingAnimation) updateView(VIEWPORT_TABS.EDITOR)
    $: {
        if (isReady) {
            if (!engine.executingAnimation) {
                FilesStore.watchFiles()
                if (viewTab !== VIEWPORT_TABS.UI) {
                    Engine.start()
                    CameraTracker.startTracking()
                    gpu.canvas.style.opacity = "1"
                } else {

                    CameraTracker.stopTracking()
                    Engine.stop()
                    gpu.canvas.style.opacity = "0"
                }
            } else {
                FilesStore.unwatchFiles()
                CameraTracker.stopTracking()
                Engine.start()
                gpu.canvas.style.opacity = "1"
                gpu.canvas.style.width = "100%"
            }
        }
    }
    $: console.log(viewTab, VIEWPORT_TABS.EDITOR)
</script>

<div class="viewport" bind:this={ref}>
    {#if engine.viewportInitialized}
        <div class="header">
            {#if viewTab === VIEWPORT_TABS.EDITOR}
                <EditorHeader
                        settings={settings}
                        engine={engine}
                >
                    <Header
                            setViewportTab={updateView}
                            viewportTab={viewTab}
                            engine={engine}
                            settings={settings}
                            slot="switch-button"
                    />
                </EditorHeader>
            {:else if viewTab === VIEWPORT_TABS.UI}
                <Header
                        setViewportTab={updateView}
                        viewportTab={viewTab}
                        engine={engine}
                        settings={settings}
                />
                <UIEditorHeader settings={settings}/>
            {:else if viewTab === VIEWPORT_TABS.TERRAIN}
                <Header
                        setViewportTab={updateView}
                        viewportTab={viewTab}
                        engine={engine}
                        settings={settings}
                />
                <TerrainHeader settings={settings}/>
            {/if}
        </div>
    {/if}
    <div class="wrapper" >
        <div bind:this={canvasRef}></div>
        {#if settings.showMetrics}
            <Metrics/>
        {/if}
        {#if !engine.executingAnimation && isReady}
            {#if viewTab === VIEWPORT_TABS.UI}
                <UILayout engine={engine} settings={settings}/>
            {:else if viewTab === VIEWPORT_TABS.TERRAIN}
                <TerrainLayout engine={engine} settings={settings}/>
            {:else}
                <EditorLayout
                        settings={settings}
                        engine={engine}
                        translate={translate}
                        isReady={isReady}
                />
            {/if}
        {/if}
    </div>
    <GizmoToolTip/>
</div>

<style>
    .viewport {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: var(--pj-background-secondary);
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
        position: relative;
    }

    .header {
        display: flex;
        align-items: center;
        gap: 4px;
        width: 100%;
        padding: 0 2px;
        min-height: 28px;
        max-height: 28px;
        user-select: none;
    }


</style>