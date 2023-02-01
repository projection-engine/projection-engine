<script>
    import RENDER_TARGET from "../../static/RENDER_TARGET"
    import {onDestroy, onMount} from "svelte";
    import updateRenderer from "./utils/update-renderer";
    import EngineStore from "../../stores/EngineStore";
    import SettingsStore from "../../stores/SettingsStore";
    import SelectionStore from "../../stores/SelectionStore";
    import AssetAPI from "../../lib/fs/AssetAPI";
    import VisualsStore from "../../stores/VisualsStore";
    import Engine from "../../../../../engine-core/Engine";
    import EngineTools from "../../../../../engine-tools/EngineTools";
    import LevelController from "../../lib/utils/LevelController";
    import UIAPI from "../../../../../engine-core/lib/rendering/UIAPI";
    import GPU from "../../../../../engine-core/GPU";

    export let initializeEditor

    let canvasRef
    let done = false
    let engine = {}
    let settings = {}
    let visuals = {}
    let selected = []
    const unsubscribeSelection = SelectionStore.getStore(() => selected = SelectionStore.engineSelected)
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    const unsubscribeVisuals = VisualsStore.getStore(v => visuals = v)

    onMount(() => {

        Engine.initializeContext(
            canvasRef,
            {w: visuals.resolutionX, h: visuals.resolutionY},
            AssetAPI.readAsset,
            AssetAPI.readMetadata,
            true
        ).then(async () => {
            await EngineTools.initialize().catch()
            await LevelController.loadLevel().catch()
            initializeEditor()
            UIAPI.buildUI(GPU.canvas.parentElement)
            UIAPI.hideUI()

            done = true

        })
    })

    onDestroy(() => {
        unsubscribeVisuals()
        unsubscribeSelection()

        unsubscribeEngine()
        unsubscribeSettings()
    })
    $: {
        if(engine.executingAnimation)
            UIAPI.showUI()
    }
    $: if (done) updateRenderer(selected, engine, {...settings, ...visuals})
</script>


<div id={RENDER_TARGET} class="stretch">
    <canvas
            class="stretch"
            data-svelteviewport="-"
            bind:this={canvasRef}
            width={visuals.resolutionX}
            height={visuals.resolutionY}
    ></canvas>
</div>

<style>

    .stretch {
        width: 100%;
        height: 100%;
        background: transparent;
        position: relative;
        overflow: hidden;
    }
</style>