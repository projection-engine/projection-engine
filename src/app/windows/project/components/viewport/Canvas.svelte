<script>
    import RENDER_TARGET from "../../static/misc/RENDER_TARGET";
    import bindShortcuts from "../shortcuts/hooks/bindShortcuts";
    import {onDestroy, onMount} from "svelte";
    import windowBuilder from "../../libs/engine/window-builder";
    import {engine as engineStore} from "../../stores/engine-store";
    import EditorEngine from "../../libs/engine-extension/EditorEngine";
    import updateRenderer from "./utils/update-renderer";
    import EnglishLocalization from "../../../../static/EnglishLocalization";
    import StoreController from "../../stores/StoreController";

    export let onReady
    let canvasRef = null
    let initialized = false

    const shortcutBinding = bindShortcuts({
        focusTargetLabel: EnglishLocalization.PROJECT.VIEWPORT.TITLE,
        focusTargetIcon: "window",
        actions: []
    })

    let engine = {}
    let settings = {}
    const unsubscribeEngine = StoreController.getEngine(v => engine=v)
    const unsubscribeSettings = StoreController.getSettings(v => settings=v)
    function updateEngine(){
        updateRenderer(
            engine.viewportInitialized,
            engine.fallbackMaterial,
            engine.meshes,
            engine.materials,
            engine.entities,
            engine.cameraInitialized,
            (v) => StoreController.updateEngine({...engine, cameraInitialized: v}),
            (v) => StoreController.updateEngine({...engine, fallbackMaterial: v}),
            engine.executingAnimation,
            engine.selected,
            engine.levelScript,
            settings
        )
    }
    $: {

        if (canvasRef && !initialized) {
            initialized = true
            windowBuilder(canvasRef)
            StoreController.updateEngine({...engine, viewportInitialized: true})

            window.renderer = new EditorEngine({w: settings.resolution[0], h: settings.resolution[1]}, () => {
                updateEngine()
            })
            onReady()
        }
        if(initialized)
            updateEngine()
    }
    onMount(() => shortcutBinding.onMount(canvasRef))
    onDestroy(() => {
        shortcutBinding.onDestroy(canvasRef)
        unsubscribeEngine()
        unsubscribeSettings()
    })
    $: {
        shortcutBinding.rebind(canvasRef, engine.executingAnimation)
    }
</script>

<canvas
        bind:this={canvasRef}
        id={RENDER_TARGET}
        style={`width: ${settings.visible.sideBarViewport ? "calc(100% - 23px)" : "100%"}; height: 100%; background: transparent`}
        width={settings.resolution[0]}
        height={settings.resolution[1]}
></canvas>