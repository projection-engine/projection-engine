<script>
    import Header from "./components/Header.svelte";
    import INFORMATION_CONTAINER from "../../data/INFORMATION_CONTAINER";
    import Localization from "../../../shared/libs/Localization";
    import EngineStore from "../../stores/EngineStore";
    import {onDestroy} from "svelte";
    import VIEWPORT_TABS from "../../data/VIEWPORT_TABS";
    import EditorLayout from "./components/editor/EditorLayout.svelte";
    import UILayout from "./components/ui/UILayout.svelte";
    import MetricsPass from "../../../../public/engine/production/passes/misc/MetricsPass";
    import SettingsStore from "../../stores/SettingsStore";
    import GizmoToolTip from "./components/editor/GizmoToolTip.svelte";
    import {Engine} from "../../../../public/engine/production";
    import {CameraTracker} from "../../../../public/engine/editor";
    import EditorHeader from "./components/editor/EditorHeader.svelte";
    import UIEditorHeader from "./components/ui/UIEditorHeader.svelte";

    export let isReady = false


    let viewportTab = VIEWPORT_TABS.EDITOR
    let engine = {}
    let settings = {}
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    onDestroy(() => {
        unsubscribeEngine()
        unsubscribeSettings()
    })

    const translate = (key) => Localization.PROJECT.VIEWPORT[key]

    $: if (isReady) MetricsPass.renderTarget = document.getElementById(INFORMATION_CONTAINER.FPS)
    $: if (engine.executingAnimation) viewportTab = VIEWPORT_TABS.EDITOR
    $: {
        if (isReady) {
            if (!engine.executingAnimation) {
                if (viewportTab === VIEWPORT_TABS.EDITOR) {
                    CameraTracker.startTracking()
                    Engine.start()
                    gpu.canvas.style.opacity = "1"
                    if (settings.visible.sideBarViewport)
                        gpu.canvas.style.width = "calc(100% - 23px)"
                    else
                        gpu.canvas.style.width = "100%"
                } else {
                    CameraTracker.stopTracking()
                    Engine.stop()
                    gpu.canvas.style.width = "100%"
                    gpu.canvas.style.opacity = "0"
                }
            } else {
                CameraTracker.stopTracking()
                Engine.start()
                gpu.canvas.style.opacity = "1"
                gpu.canvas.style.width = "100%"
            }
        }
    }


</script>

<div class="viewport">
    {#if !engine.executingAnimation}
        <div class="header">
            {#if viewportTab === VIEWPORT_TABS.EDITOR}
                <EditorHeader
                        settings={settings}
                        engine={engine}
                >
                    <Header
                            setViewportTab={v => viewportTab = v}
                            viewportTab={viewportTab}
                            engine={engine}
                            settings={settings}
                            slot="switch-button"
                    />
                </EditorHeader>
            {:else if viewportTab === VIEWPORT_TABS.UI}
                <Header
                        setViewportTab={v => viewportTab = v}
                        viewportTab={viewportTab}
                        engine={engine}
                        settings={settings}
                />
                <UIEditorHeader
                    settings={settings}
                />
            {/if}
        </div>
    {/if}
    <div class="wrapper">
        <slot name="canvas"/>
        {#if !engine.executingAnimation}
            {#if viewportTab === VIEWPORT_TABS.EDITOR && isReady}
                <EditorLayout
                        settings={settings}
                        engine={engine}
                        translate={translate}
                        isReady={isReady}
                />
            {:else if viewportTab === VIEWPORT_TABS.UI}
                <UILayout engine={engine} settings={settings}/>
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