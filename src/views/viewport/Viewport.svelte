<script>
    import Header from "./components/Header.svelte";
    import Localization from "../../libs/libs/Localization";
    import EngineStore from "../../stores/EngineStore";
    import {onDestroy, onMount} from "svelte";
    import VIEWPORT_TABS from "../../data/VIEWPORT_TABS";
    import EditorLayout from "./components/editor/EditorLayout.svelte";
    import UILayout from "./components/ui/UILayout.svelte";
    import SettingsStore from "../../stores/SettingsStore";
    import GizmoToolTip from "./components/editor/GizmoToolTip.svelte";
    import {CameraTracker} from "../../../public/engine/editor";
    import EditorHeader from "./components/editor/EditorHeader.svelte";
    import UIEditorHeader from "./components/ui/UIEditorHeader.svelte";
    import HotKeysController from "../../libs/libs/HotKeysController";
    import TerrainHeader from "./components/terrain/TerrainHeader.svelte";
    import TerrainLayout from "./components/terrain/TerrainLayout.svelte";
    import viewportHotkeys from "../../templates/viewport-hotkeys";
    import RENDER_TARGET from "../../data/RENDER_TARGET";
    import Metrics from "./components/Metrics.svelte";
    import Tabs from "../../components/tabs/Tabs.svelte";
    import removeTab from "./utils/remove-tab";
    import addNewTab from "./utils/add-new-tab";
    import getIcon from "./utils/get-icon";
    import updateViewport from "./utils/update-viewport";
    import Preferences from "../../components/preferences/Preferences.svelte";

    export let updateView
    export let viewTab

    let currentTab = 0
    let canvasRef
    let engine = {}
    let settings = {}
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)

    let prevLength = 0
    $: {
        if(prevLength !== viewTab.length) {
            prevLength = viewTab.length
            currentTab = viewTab.length - 1
        }
    }
    let ref
    $: currentView = viewTab[currentTab]
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
    $: updateViewport(engine, isReady, currentView)
    $: tabs = viewTab.map(v => ({name: translate(v), icon: getIcon(v)}))

    function setViewportTab(value) {
        const clone = [...viewTab]
        clone[currentTab] = value
        updateView(clone)
    }
</script>

<div class="viewport" bind:this={ref}>
    <div style="padding: 3px">
        <Tabs
                addNewTab={_ => addNewTab(viewTab, updateView)}
                removeTab={i => removeTab(i, viewTab,  updateView, currentTab, v => currentTab = v)}
                tabs={tabs}
                currentTab={currentTab}
                setCurrentView={v => currentTab = v}
                allowDeletion={false}
        />
    </div>
    <div class="wrapper">
        {#if currentView !== VIEWPORT_TABS.PREFERENCES}
            <div class="header">
                {#if currentView === VIEWPORT_TABS.EDITOR}
                    <EditorHeader
                            settings={settings}
                            engine={engine}
                    >
                        <Header
                                setViewportTab={setViewportTab}
                                viewportTab={currentView}
                                engine={engine}
                                settings={settings}
                                slot="switch-button"
                        />
                    </EditorHeader>
                {:else if currentView === VIEWPORT_TABS.UI}
                    <Header
                            setViewportTab={setViewportTab}
                            viewportTab={currentView}
                            engine={engine}
                            settings={settings}
                    />
                    <UIEditorHeader settings={settings}/>
                {:else if currentView === VIEWPORT_TABS.TERRAIN}
                    <Header
                            setViewportTab={setViewportTab}
                            viewportTab={currentView}
                            engine={engine}
                            settings={settings}
                    />
                    <TerrainHeader settings={settings}/>
                {/if}
            </div>
        {/if}
        <div bind:this={canvasRef}></div>
        {#if settings.showMetrics}
            <Metrics/>
        {/if}
        {#if !engine.executingAnimation && isReady}
            {#if currentView === VIEWPORT_TABS.UI}
                <UILayout engine={engine} settings={settings}/>
            {:else if currentView === VIEWPORT_TABS.TERRAIN}
                <TerrainLayout engine={engine} settings={settings}/>
            {:else if currentView === VIEWPORT_TABS.EDITOR}
                <EditorLayout
                        settings={settings}
                        engine={engine}
                        translate={translate}
                        isReady={isReady}
                />
            {:else if currentView === VIEWPORT_TABS.PREFERENCES}
                <Preferences/>
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
        background-color: var(--pj-background-tertiary);
        border-radius: 5px;
        position: relative;
        display: flex;
        flex-direction: column;
    }

    .wrapper {
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
        min-height: 25px;
        max-height: 25px;
        user-select: none;
        position: absolute;
        top: 0;
        z-index: 100;
        backdrop-filter: blur(10px) brightness(80%);
    }


</style>