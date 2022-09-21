<script>
    import Header from "./components/Header.svelte";
    import INFORMATION_CONTAINER from "../../data/INFORMATION_CONTAINER";
    import Localization from "../../../shared/libs/Localization";
    import EngineStore from "../../stores/EngineStore";
    import {onDestroy, onMount} from "svelte";
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
    import HotKeys from "../../components/metrics/libs/HotKeys";
    import getHotkeys from "./utils/get-hotkeys";
    import NodeFS from "../../../shared/libs/NodeFS";
    import FilesStore from "../../stores/FilesStore";

    export let isReady = false
    export let updateView
    export let viewTab = VIEWPORT_TABS.EDITOR


    let engine = {}
    let settings = {}
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    let ref
    onMount(() => {
        HotKeys.bindAction(
            ref,
            getHotkeys(),
            "public",
            Localization.PROJECT.VIEWPORT.TITLE
        )
    })
    onDestroy(() => {
        HotKeys.unbindAction(ref)
        unsubscribeEngine()
        unsubscribeSettings()
    })

    const translate = (key) => Localization.PROJECT.VIEWPORT[key]

    $: if (isReady) MetricsPass.renderTarget = document.getElementById(INFORMATION_CONTAINER.FPS)
    $: if (engine.executingAnimation) updateView(VIEWPORT_TABS.EDITOR)
    $: console.log(viewTab)
    $: {
        if (isReady) {
            if (!engine.executingAnimation) {
                FilesStore.watchFiles()
                if (viewTab === VIEWPORT_TABS.EDITOR) {
                    Engine.start()
                    CameraTracker.startTracking()
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
                FilesStore.unwatchFiles()
                CameraTracker.stopTracking()
                Engine.start()
                gpu.canvas.style.opacity = "1"
                gpu.canvas.style.width = "100%"
            }
        }
    }


</script>

<div class="viewport" bind:this={ref}>
    {#if !engine.executingAnimation && engine.viewportInitialized}
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
                <UIEditorHeader
                        settings={settings}
                />
            {/if}
        </div>
    {/if}
    <div class="wrapper">
        <slot name="canvas"/>
        {#if !engine.executingAnimation && isReady}
            {#if viewTab === VIEWPORT_TABS.EDITOR }
                <EditorLayout
                        settings={settings}
                        engine={engine}
                        translate={translate}
                        isReady={isReady}
                />
            {:else if viewTab === VIEWPORT_TABS.UI}
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