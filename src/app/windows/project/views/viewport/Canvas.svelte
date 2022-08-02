<script>
    import RENDER_TARGET from "../../static/misc/RENDER_TARGET";
    import bindShortcut from "../shortcuts/libs/bind-shortcut";
    import {onDestroy, onMount} from "svelte";
    import windowBuilder from "../../libs/engine/window-builder";
    import EditorEngine from "../../libs/engine-extension/EditorEngine";
    import updateRenderer from "./utils/update-renderer";
    import EnglishLocalization from "../../../../libs/EnglishLocalization";
    import DataStoreController from "../../stores/DataStoreController";
    import getShortcuts from "./utils/get-shortcuts";
    import bindContextTarget from "../../../../components/context-menu/libs/bind-context-target";
    import getContextMenu from "./utils/get-context-menu";

    export let onReady
    const TRIGGERS = ["data-viewport"]
    let canvasRef = null
    let initialized = false


    let engine = {}
    let settings = {}
    const unsubscribeEngine = DataStoreController.getEngine(v => engine = v)
    const unsubscribeSettings = DataStoreController.getSettings(v => settings = v)
    const shortcutBinding = bindShortcut({
        focusTargetLabel: EnglishLocalization.PROJECT.VIEWPORT.TITLE,
        focusTargetIcon: "window",
        actions: getShortcuts()
    })

    const contextMenuBinding = bindContextTarget(RENDER_TARGET, TRIGGERS)
    $: contextMenuBinding.rebind(getContextMenu(engine))
    onMount(() => shortcutBinding.onMount(canvasRef))
    onDestroy(() => {
        shortcutBinding.onDestroy(canvasRef)
        unsubscribeEngine()
        unsubscribeSettings()
        contextMenuBinding.onDestroy()
    })

    $: {
        shortcutBinding.rebind(canvasRef, engine.executingAnimation)
        if (canvasRef && !initialized) {
            initialized = true
            windowBuilder(canvasRef)
            DataStoreController.updateEngine({...engine, viewportInitialized: true})

            window.renderer = new EditorEngine(
                {w: settings.resolution[0], h: settings.resolution[1]},
                ref => updateRenderer(ref, engine, settings)
            )

            onReady()
        }
        if (initialized)
            updateRenderer(window.renderer, engine, settings)
    }

</script>

<canvas
        data-viewport="-"
        bind:this={canvasRef}
        id={RENDER_TARGET}
        style={`width: ${settings.visible.sideBarViewport ? "calc(100% - 23px)" : "100%"}; height: 100%; background: transparent`}
        width={settings.resolution[0]}
        height={settings.resolution[1]}
></canvas>