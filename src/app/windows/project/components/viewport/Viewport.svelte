<script>
    import ViewportSettings from "./components/Header.svelte";
    import INFORMATION_CONTAINER from "../../data/misc/INFORMATION_CONTAINER";
    import Localization from "../../../../libs/Localization";
    import RendererStoreController from "../../stores/RendererStoreController";
    import {onDestroy} from "svelte";
    import EngineLoop from "../../libs/engine/libs/loop/EngineLoop";
    import VIEWPORT_TABS from "../../data/misc/VIEWPORT_TABS";
    import EditorLayout from "./layouts/EditorLayout.svelte";
    import UILayout from "./layouts/UILayout.svelte";

    export let isReady = false


    let engine = {}
    let settings = {}
    const unsubscribeEngine = RendererStoreController.getEngine(v => engine = v)
    const unsubscribeSettings = RendererStoreController.getSettings(v => settings = v)
    onDestroy(() => {
        unsubscribeEngine()
        unsubscribeSettings()
    })

    $: {
        if (engine.executingAnimation)
            RendererStoreController.updateSettings({...settings, viewportTab: VIEWPORT_TABS.PLAY})
        else if (settings.viewportTab === VIEWPORT_TABS.PLAY)
            RendererStoreController.updateSettings({...settings, viewportTab: VIEWPORT_TABS.EDITOR})
    }

    const translate = (key) => Localization.PROJECT.VIEWPORT[key]

    $: if (isReady) EngineLoop.miscMap.get("metrics").renderTarget = document.getElementById(INFORMATION_CONTAINER.FPS)
    $: {
        if (isReady) {
            if (settings.visible.sideBarViewport && settings.viewportTab === VIEWPORT_TABS.EDITOR)
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
                translate={translate}
                settings={settings}
        />
    {/if}
    <div class="wrapper">
        <slot name="canvas"/>
        {#if settings.viewportTab === VIEWPORT_TABS.EDITOR && isReady}
            <EditorLayout settings={settings} engine={engine} translate={translate} isReady={isReady}/>
        {:else if settings.viewportTab === VIEWPORT_TABS.UI}
            <UILayout />
        {/if}

    </div>

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


</style>