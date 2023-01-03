<script>

    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import EngineStore from "../../stores/EngineStore";
    import {onDestroy, onMount} from "svelte";
    import VIEWPORT_TABS from "../../../static/VIEWPORT_TABS.ts";
    import SettingsStore from "../../stores/SettingsStore";
    import HotKeysController from "../../lib/utils/HotKeysController";
    import viewportHotkeys from "../../templates/viewport-hotkeys";
    import RENDER_TARGET from "../../../static/RENDER_TARGET";
    import Tabs from "../../../components/tabs/Tabs.svelte";
    import removeTab from "./utils/remove-tab";
    import updateViewport from "./utils/update-viewport";
    import VIEWS from "../../../components/view/static/VIEWS";
    import View from "../../../components/view/components/View.svelte";
    import getViewIcon from "../../../components/view/utils/get-view-icon";
    import TabsStore from "../../stores/TabsStore";
    import GPU from "../../../../engine-core/GPU";

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
    $: currentTab = TabsStore.getValue("viewport")
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)

    const setViewportTab = (value, index = currentTab) => {
        const clone = [...viewTab]
        clone[index].type = value
        updateViewport(engine, value)
        updateView(clone)
    }

    $: {
        if (ref != null)
            HotKeysController.bindAction(
                ref,
                Object.values(viewportHotkeys(settings)),
                "public",
                LOCALIZATION_EN.VIEWPORT
            )
    }

    $: updateViewport(engine, viewTab[currentTab])
    $: tabs = viewTab.map(v => {
        v.name = LOCALIZATION_EN[v.type]
        v.icon = getViewIcon(v.type)
        return v
    })
    $: viewTemplates = [...Object.values(VIEWS), VIEWPORT_TABS.EDITOR].map(value => ({
        name: LOCALIZATION_EN[value],
        id: value
    }))
    $: isCanvasHidden = viewTab[currentTab].type !== VIEWPORT_TABS.EDITOR
    $: {
        if (isCanvasHidden && GPU.context) {
            GPU.canvas.style.zIndex = "-1"
            GPU.canvas.style.position = "absolute"
        } else if (GPU.context) {
            GPU.canvas.style.zIndex = "1"
            GPU.canvas.style.position = "relative"
        }

    }

    onMount(() => {
        window.d = () => viewTab
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
                addNewTab={item => {
                        const clone  = [...tabs]
                        clone.push({color: [255, 255, 255], type: item?.id || VIEWS.PREFERENCES })
                        updateView(clone)
                }}
                removeTab={i => removeTab(i, viewTab,  updateView, currentTab, v => TabsStore.update("viewport", undefined, v))}
                removeMultipleTabs={_ => {
                    const current = tabs[currentTab]
                    TabsStore.update("viewport", undefined, 0)
                    updateView([current])
                }}
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
                    instance={viewTab[currentTab]}
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