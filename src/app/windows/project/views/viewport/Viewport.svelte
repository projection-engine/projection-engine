<script>
    import GIZMOS from "../../data/misc/GIZMOS"
    import updateCursor from "./utils/update-cursor"
    import onViewportClick from "./utils/on-viewport-click"
    import Conversion from "../../libs/engine/services/Conversion";
    import viewportSelectionBoxWorker from "../../../../libs/web-workers/viewport-selection-box-worker";
    import ViewportSettings from "./components/Header.svelte";
    import CameraBar from "./components/columns/CameraBar.svelte";
    import INFORMATION_CONTAINER from "../../data/misc/INFORMATION_CONTAINER";
    import Localization from "../../../../libs/Localization";
    import GizmoBar from "./components/columns/GizmoBar.svelte";
    import SideOptions from "./components/QuickAccess.svelte";
    import COMPONENTS from "../../libs/engine/data/COMPONENTS";
    import RendererStoreController from "../../stores/RendererStoreController";
    import {onDestroy} from "svelte";
    import SelectBox from "../../../../components/select-box/SelectBox.svelte";
    import RENDER_TARGET from "../../data/misc/RENDER_TARGET";
    import drawIconsToBuffer from "./utils/draw-icons-to-buffer";
    import EngineLoop from "../../libs/engine/libs/loop/EngineLoop";
    import ViewportPicker from "../../libs/engine/services/ViewportPicker";
    import Loader from "../../libs/loader/Loader";
    import VIEWPORT_TABS from "../../data/misc/VIEWPORT_TABS";
    import EditorLayout from "./layouts/EditorLayout.svelte";

    export let isReady = false

    let currentTab = VIEWPORT_TABS.EDITOR
    $: {
        if (engine.executingAnimation)
            currentTab = VIEWPORT_TABS.PLAY
        else
            currentTab = VIEWPORT_TABS.EDITOR
    }

    let engine = {}
    let settings = {}
    const unsubscribeEngine = RendererStoreController.getEngine(v => engine = v)
    const unsubscribeSettings = RendererStoreController.getSettings(v => settings = v)
    onDestroy(() => {
        unsubscribeEngine()
        unsubscribeSettings()
    })

    const translate = (key) => Localization.PROJECT.VIEWPORT[key]
    $: if (isReady) EngineLoop.miscMap.get("metrics").renderTarget = document.getElementById(INFORMATION_CONTAINER.FPS)


    $: {
        if (isReady) {
            if (settings.visible.sideBarViewport && currentTab === VIEWPORT_TABS.EDITOR)
                gpu.canvas.style.width = "calc(100% - 23px)"
            else
                gpu.canvas.style.width = "100%"
        }
    }
</script>


<div class="viewport">
    {#if !engine.executingAnimation}
        <ViewportSettings
                engine={engine}
                currentTab={currentTab}
                setCurrentTab={v => currentTab = v}
                translate={translate}
                settings={settings}
        />
    {/if}
    <div class="wrapper">
        <slot name="canvas"/>
        {#if currentTab === VIEWPORT_TABS.EDITOR && isReady}
            <EditorLayout settings={settings} engine={engine} translate={translate} isReady={isReady}/>
        {/if}

    </div>

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
        position: relative;
    }


</style>