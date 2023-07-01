<script>

    import EngineStore from "../../../stores/EngineStore"
    import {onDestroy, onMount} from "svelte"
    import VIEWPORT_TABS from "../../static/VIEWPORT_TABS.ts"
    import SettingsStore from "../../../stores/SettingsStore"
    import HotKeysController from "../../../shared/lib/HotKeysController"
    import getViewportHotkeys from "../../templates/get-viewport-hotkeys"
    import Tabs from "../../components/tabs/Tabs.svelte"
    import VIEWS from "../../components/view/static/VIEWS"
    import View from "../../components/view/components/View.svelte"
    import TabsStore from "../../../stores/TabsStore"
    import GPU from "../../../../engine-core/GPU"
    import RENDER_TARGET from "../../static/RENDER_TARGET"
    import LocalizationEN from "../../../../shared/LocalizationEN"
    import ViewportUtil from "../../util/ViewportUtil"
    import ViewsUtil from "../../util/ViewsUtil"
    import TabsStoreUtil from "../../util/TabsStoreUtil"

    const COMPONENT_ID = crypto.randomUUID()

    /** @type {function} */
    export let updateView
    /** @type {object[]} */
    export let viewTab

    let currentTab = TabsStoreUtil.getCurrentTabByCurrentView("viewport")
    let engine = {}
    let settings = {}
    let ref
    let focused = false
    let currentViewTab
    let viewportTabs
    let isCanvasHidden

    const VIEW_TEMPLATES = [...Object.values(VIEWS), ...Object.values(VIEWPORT_TABS)].map(value => ({name: LocalizationEN[value], id: value}))
    const unsubscribeTabs = TabsStore.getStore(() => {
    	currentTab = TabsStoreUtil.getCurrentTabByCurrentView("viewport")
    	focused = ref === TabsStoreUtil.getFocusedTab()
    })
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)

    const setViewportTab = (value, index = currentTab) => {
    	const clone = [...viewTab]
    	clone[index].type = value
    	ViewportUtil.updateViewport(engine, value)
    	updateView(clone)
    }

    $: currentViewTab = viewTab[currentTab]
    $: ViewportUtil.updateViewport(engine, currentViewTab)
    $: viewportTabs = viewTab.map(v => {
    	v.name = LocalizationEN[v.type]
    	v.icon = ViewsUtil.getViewIcon(v.type)
    	return v
    })
    $: isCanvasHidden = currentViewTab.type !== VIEWPORT_TABS.EDITOR

    $: {
    	if (isCanvasHidden && GPU.context) {
    		GPU.canvas.style.zIndex = "-1"
    		GPU.canvas.style.position = "absolute"
    	} else if (GPU.context) {
    		GPU.canvas.style.zIndex = "1"
    		GPU.canvas.style.position = "relative"
    	}
    }

    $: {
    	if (engine.executingAnimation && viewportTabs[currentTab].type !== VIEWPORT_TABS.EDITOR)
    		setViewportTab(VIEWPORT_TABS.EDITOR)
    }
    onMount(() => {
    	HotKeysController.bindAction(ref, Object.values(getViewportHotkeys()), "public", LocalizationEN.VIEWPORT)
    	const wrapperRef = ref.lastElementChild
    	wrapperRef.insertBefore(document.getElementById(RENDER_TARGET), wrapperRef.firstElementChild)
    })

    onDestroy(() => {
    	unsubscribeTabs()
    	HotKeysController.unbindAction(ref)
    	unsubscribeEngine()
    	unsubscribeSettings()
    })

    const addNewTab = item => {
    	const clone = [...viewportTabs]
    	clone.push({color: [255, 255, 255], type: item?.id || VIEWS.COMPONENT})
    	updateView(clone)
    }

    const removeMultipleTabs = () => {
    	const current = viewportTabs[currentTab]
    	TabsStoreUtil.updateByAttributes("viewport", undefined, 0)
    	updateView([current])
    }
</script>

<div
        class="viewport"
        bind:this={ref}
        on:mousedown={() => TabsStoreUtil.setFocusedTab(ref)}
>
    <div style="height: 30px">
        <Tabs
                addNewTab={addNewTab}
                allowDeletion={false}
                currentTab={currentTab}
                disabled={engine.executingAnimation}
                focused={focused}
                removeMultipleTabs={removeMultipleTabs}
                removeTab={i => ViewportUtil.removeTab(i, viewTab,  updateView, currentTab, v => TabsStoreUtil.updateByAttributes("viewport", undefined, v))}
                setCurrentView={v => TabsStoreUtil.updateByAttributes("viewport", undefined, v)}
                tabs={viewportTabs}
                templates={VIEW_TEMPLATES}
                updateView={setViewportTab}
        />
    </div>
    <div class="wrapper">
        {#if engine.isReady}
            <View
                    instance={currentViewTab}
                    id={"VIEWPORT"}
                    index={currentTab}
                    groupIndex={0}
                    styles="position: absolute; top: 0; display: flex; align-items: center;"
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