<script>
    import RENDER_TARGET from "../../static/misc/RENDER_TARGET";
    import bindShortcuts from "../shortcuts/hooks/bindShortcuts";
    import {onDestroy, onMount} from "svelte";
    import windowBuilder from "../../libs/engine/window-builder";
    import {engine as engineStore} from "../../stores/engine-store";
    import EditorEngine from "../../libs/engine-extension/EditorEngine";
    import updateRenderer from "./utils/update-renderer";
    import {get} from "svelte/store";
    import {settingsStore} from "../../stores/settings-store";
    import EnglishLocalization from "../../../../static/EnglishLocalization";
    export let onReady
    let canvasRef = null
    let initialized = false

    const shortcutBinding = bindShortcuts({
        focusTargetLabel: EnglishLocalization.PROJECT.VIEWPORT.TITLE,
        focusTargetIcon: "window",
        actions: []
    })

    const engine = get(engineStore), settings = get(settingsStore)

    $: {
        if (canvasRef && !initialized) {
            initialized = true
            windowBuilder(canvasRef)
            engineStore.set({...engine, viewportInitialized: true})

            window.renderer = new EditorEngine({w: settings.resolution[0], h: settings.resolution[1]}, () => {
                updateRenderer(
                    engine.viewportInitialized,
                    engine.fallbackMaterial,
                    engine.meshes,
                    engine.materials,
                    engine.entities,
                    engine.cameraInitialized,
                    (v) => engineStore.set({...engine, cameraInitialized: v}),
                    (v) => engineStore.set({...engine, fallbackMaterial: v}),
                    engine.executingAnimation,
                    engine.selected,
                    engine.levelScript,
                    settings
                )
            })
            onReady()
        }
    }
    onMount(() => shortcutBinding.onMount(canvasRef))
    onDestroy(() => shortcutBinding.onDestroy(canvasRef))
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