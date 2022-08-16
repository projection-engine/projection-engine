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
    import VIEWPORT_TABS from "../../data/misc/VIEWPORT_TABS";
    import UIStoreController from "../../stores/UIStoreController";

    export let onReady
    const TRIGGERS = ["data-viewport"]
    let canvasRef = null
    let done = false
    let engine = {}
    let settings = {}
    let ui
    let uiStore = {}
    const unsubscribeEngine = RendererStoreController.getEngine(v => engine = v)
    const unsubscribeSettings = RendererStoreController.getSettings(v => settings = v)
    const unsubscribeUI = UIStoreController.getStore(v => uiStore = v)
    const contextMenuBinding = bindContextTarget(RENDER_TARGET, TRIGGERS)
    $: contextMenuBinding.rebind(getContextMenu(engine))

    onMount(() => {
        UIRenderer.renderTarget = ui
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
    let lastSize = 0
    $: renderUI = engine.executingAnimation || settings.viewportTab === VIEWPORT_TABS.UI
    $: {
        if (uiStore.entities.size > lastSize && renderUI) {
            UIRenderer.restart()
            lastSize = uiStore.entities.size
        }
    }
    $: {
        if (renderUI)
            UIRenderer.start()
        else
            UIRenderer.stop()
    }

    $: if (done) updateRenderer(engine, settings)
</script>


<div style={renderUI ? undefined : "display: none;"} id={UI_RENDER_TARGET} bind:this={ui} class="ui"></div>
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
        z-index: 1;
    }
    .ui > * {
        all: initial;
    }

</style>