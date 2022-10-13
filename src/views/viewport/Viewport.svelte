<script>

    import Localization from "../../libs/libs/Localization";
    import EngineStore from "../../stores/EngineStore";
    import {onDestroy, onMount} from "svelte";
    import VIEWPORT_TABS from "../../data/VIEWPORT_TABS";
    import SettingsStore from "../../stores/SettingsStore";
    import GizmoToolTip from "../editor/components/GizmoToolTip.svelte";
    import HotKeysController from "../../libs/libs/HotKeysController";
    import viewportHotkeys from "../../templates/viewport-hotkeys";
    import RENDER_TARGET from "../../data/RENDER_TARGET";
    import Metrics from "./components/Metrics.svelte";
    import Tabs from "../../components/tabs/Tabs.svelte";
    import removeTab from "./utils/remove-tab";
    import addNewTab from "./utils/add-new-tab";

    import updateViewport from "./utils/update-viewport";
    import VIEWS from "../../components/view/data/VIEWS";
    import View from "../../components/view/components/View.svelte";
    import getViewIcon from "../../components/view/utils/get-view-icon";

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
        if (prevLength !== viewTab.length) {
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
    onMount(() => canvasRef.replaceWith(document.getElementById(RENDER_TARGET + "VIEWPORT").firstElementChild))

    onDestroy(() => {
        HotKeysController.unbindAction(ref)
        unsubscribeEngine()
        unsubscribeSettings()
    })

    const translate = (key) => Localization.PROJECT.VIEWPORT[key]
    $: updateViewport(engine, isReady, currentView)
    $: tabs = viewTab.map(v => ({name: Localization.COMPONENTS.VIEWS[v], icon: getViewIcon(v)}))

    function setViewportTab(value, index = currentTab) {
        const clone = [...viewTab]
        clone[index] = value
        updateView(clone)
    }

    $: viewTemplates = [...Object.values(VIEWS), ...Object.values(VIEWPORT_TABS)].map(value => ({
        name: Localization.COMPONENTS.VIEWS[value],
        id: value
    }))

    $: isCanvasHidden = currentView !== VIEWPORT_TABS.EDITOR && currentView !== VIEWPORT_TABS.TERRAIN
    $: {

        if (isCanvasHidden && window.gpu) {
            gpu.canvas.style.zIndex = "-1"
            gpu.canvas.style.position = "absolute"
        }
        else if (window.gpu) {
            gpu.canvas.style.zIndex = "1"
            gpu.canvas.style.position = "relative"
        }

    }
</script>

<div class="viewport" bind:this={ref}>
    <div style="height: 30px">
        <Tabs
                disabled={engine.executingAnimation}
                updateView={setViewportTab}
                templates={viewTemplates}
                addNewTab={_ => addNewTab(viewTab, updateView)}
                removeTab={i => removeTab(i, viewTab,  updateView, currentTab, v => currentTab = v)}
                tabs={tabs}
                currentTab={currentTab}
                setCurrentView={v => {
                    console.trace(v)
                    currentTab = v
                }}
                allowDeletion={false}
        />
    </div>
    <div class="wrapper">
        <div bind:this={canvasRef}></div>
        {#if isReady}
            <View
                    instance={currentView}
                    id={"VIEWPORT"}
                    index={currentTab}
                    groupIndex={0}
                    styles={
                    !isCanvasHidden ?
                    `
                        position: absolute;
                        top: 0;
                        display: flex;
                        align-items: center;
                    ` : undefined}
                    switchView={setViewportTab}
            />
        {/if}
        {#if settings.showMetrics}
            <Metrics/>
        {/if}
    </div>
    <GizmoToolTip/>
</div>

<style>
    .viewport {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: var(--pj-background-secondary);
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
</style>