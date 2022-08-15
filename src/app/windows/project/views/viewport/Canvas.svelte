<script>
    import RENDER_TARGET from "../../data/misc/RENDER_TARGET";
    import {onDestroy, onMount} from "svelte";
    import EditorRenderer from "../../libs/engine-extension/EditorRenderer";
    import updateRenderer from "./utils/update-renderer";
    import Localization from "../../../../libs/Localization";
    import RendererStoreController from "../../stores/RendererStoreController";
    import getHotkeys from "./utils/get-hotkeys";
    import bindContextTarget from "../../../../components/context-menu/libs/bind-context-target";
    import getContextMenu from "./utils/get-context-menu";
    import Packager from "../../libs/engine/libs/builder/Packager";
    import HotKeys from "../metrics/libs/HotKeys";
    import UIRenderer from "../../libs/engine/UIRenderer";
    import UI_RENDER_TARGET from "../../data/misc/UI_RENDER_TARGET";

    export let onReady
    const TRIGGERS = ["data-viewport"]
    let canvasRef = null
    let done = false
    let engine = {}
    let settings = {}
    const unsubscribeEngine = RendererStoreController.getEngine(v => engine = v)
    const unsubscribeSettings = RendererStoreController.getSettings(v => settings = v)

    const contextMenuBinding = bindContextTarget(RENDER_TARGET, TRIGGERS)
    $: contextMenuBinding.rebind(getContextMenu(engine))

    onMount(() => {
        UIRenderer.renderTarget = document.getElementById(UI_RENDER_TARGET)
        HotKeys.bindAction(
            canvasRef,
            getHotkeys(),
            "window",
            Localization.PROJECT.VIEWPORT.TITLE
        )
        Packager.buildWindow(canvasRef, window.imageWorker)
            .then(() => {
                window.renderer = new EditorRenderer({w: settings.resolution[0], h: settings.resolution[1]})
                onReady()
                done = true
                RendererStoreController.updateEngine({...engine, viewportInitialized: true})
            })
    })

    onDestroy(() => {
        HotKeys.unbindAction(canvasRef)
        unsubscribeEngine()
        unsubscribeSettings()
        contextMenuBinding.onDestroy()
    })
    $: {
        if (engine.executingAnimation)
            UIRenderer.start()
        else
            UIRenderer.stop()
    }
    $: if (done) updateRenderer(engine, settings)
</script>


<div style={engine.executingAnimation ? undefined : "display: none;"} id={UI_RENDER_TARGET} class="ui"></div>
<canvas
        data-viewport="-"
        bind:this={canvasRef}
        id={RENDER_TARGET}
        style={`width: 100%; height: 100%; background: transparent`}
        width={settings.resolution[0]}
        height={settings.resolution[1]}
></canvas>

<style>
    .ui {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 999;
    }

</style>