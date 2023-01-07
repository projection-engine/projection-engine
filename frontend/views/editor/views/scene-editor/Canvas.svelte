<script>
    import RENDER_TARGET from "../../static/RENDER_TARGET"
    import {onDestroy, onMount} from "svelte";
    import updateRenderer from "../viewport/utils/update-renderer";
    import EngineStore from "../../stores/EngineStore";
    import SettingsStore from "../../stores/SettingsStore";
    import SelectionStore from "../../stores/SelectionStore";
    import AssetAPI from "../../lib/fs/AssetAPI";
    import VisualsStore from "../../stores/VisualsStore";
    import Engine from "../../../../../engine-core/Engine";
    import EngineTools from "../../../../../engine-tools/EngineTools";
    import LevelController from "../../lib/utils/LevelController";
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
            {w: settings.resolution[0], h: settings.resolution[1]},
            AssetAPI.readAsset,
            AssetAPI.readMetadata,
            true
        ).then(async () => {
            await EngineTools.initialize().catch()
            await LevelController.loadLevel().catch()
            initializeEditor()
            done = true
        })
    })

    onDestroy(() => {
        unsubscribeVisuals()
        unsubscribeSelection()

        unsubscribeEngine()
        unsubscribeSettings()
    })

    $: if (done) updateRenderer(selected, engine, {...settings, ...visuals})
</script>


<canvas
        data-viewport="-"
        bind:this={canvasRef}
        width={settings.resolution[0]}
        height={settings.resolution[1]}
        id={RENDER_TARGET}
        style={`width: 100%; height: 100%; background: transparent`}
></canvas>
