<script>

    import Localization from "../../libs/Localization";
    import EngineStore from "../../stores/EngineStore";
    import {onDestroy, onMount} from "svelte";
    import VIEWPORT_TABS from "../../data/VIEWPORT_TABS";
    import SettingsStore from "../../stores/SettingsStore";
    import HotKeysController from "../../libs/HotKeysController";
    import viewportHotkeys from "../../templates/viewport-hotkeys";
    import RENDER_TARGET from "../../data/RENDER_TARGET";
    import Tabs from "../../components/tabs/Tabs.svelte";
    import removeTab from "./utils/remove-tab";
    import addNewTab from "./utils/add-new-tab";
    import updateViewport from "./utils/update-viewport";
    import VIEWS from "../../components/view/data/VIEWS";
    import View from "../../components/view/components/View.svelte";
    import getViewIcon from "../../components/view/utils/get-view-icon";
    import TabsStore from "../../stores/TabsStore";

    export let updateView
    export let viewTab

    let currentTab = 0
    let canvasRef
    let engine = {}
    let settings = {}
    let ref
    let focused = false

    const unsubscribeTabs = TabsStore.getStore(_ => {
        currentTab = TabsStore.getValue("viewport")
        focused = ref === TabsStore.focused
    })
    $: currentTab = TabsStore.getValue("viewport", undefined, settings.currentView)
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    const translate = (key) => Localization.PROJECT.VIEWPORT[key]
    const setViewportTab = (value, index = currentTab) => {
        const clone = [...viewTab]
        clone[index] = value
        updateViewport(engine, value)
        updateView(clone)
    }

    $: currentView = viewTab[currentTab]
    $: {
        if (ref != null)
            HotKeysController.bindAction(
                ref,
                Object.values(viewportHotkeys(settings)),
                "public",
                Localization.PROJECT.VIEWPORT.TITLE
            )
    }

    $: updateViewport(engine, currentView)
    $: tabs = viewTab.map(v => ({name: Localization.COMPONENTS.VIEWS[v], icon: getViewIcon(v)}))
    $: viewTemplates = [...Object.values(VIEWS), ...Object.values(VIEWPORT_TABS)].map(value => ({
        name: Localization.COMPONENTS.VIEWS[value],
        id: value
    }))
    $: isCanvasHidden = currentView !== VIEWPORT_TABS.EDITOR && currentView !== VIEWPORT_TABS.TERRAIN
    $: {
        if (isCanvasHidden && window.gpu) {
            gpu.canvas.style.zIndex = "-1"
            gpu.canvas.style.position = "absolute"
        } else if (window.gpu) {
            gpu.canvas.style.zIndex = "1"
            gpu.canvas.style.position = "relative"
        }

    }

    onMount(() => {
        canvasRef.replaceWith(document.getElementById(RENDER_TARGET + "VIEWPORT").firstElementChild)
    })
    onDestroy(() => {
        unsubscribeTabs()
        HotKeysController.unbindAction(ref)
        unsubscribeEngine()
        unsubscribeSettings()
    })
</script>

<div
        class="viewport"
        bind:this={ref}
        on:mousedown={_ => TabsStore.focused = ref}
>
    <div style="height: 30px">
        <Tabs
                focused={focused}
                disabled={engine.executingAnimation}
                updateView={setViewportTab}
                templates={viewTemplates}
                addNewTab={_ => addNewTab(viewTab, updateView)}
                removeTab={i => removeTab(i, viewTab,  updateView, currentTab, v => TabsStore.update("viewport", undefined, v))}
                tabs={tabs}
                currentTab={currentTab}
                setCurrentView={v => TabsStore.update("viewport", undefined, v)}
                allowDeletion={false}
        />
    </div>
    <div class="wrapper">
        <div bind:this={canvasRef}></div>
        {#if engine.isReady}
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
    </div>
</div>

<style>
    .viewport {
        width: 100%;
        height: 100%;
        overflow: hidden;
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