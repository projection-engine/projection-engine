<script>
    import RENDER_TARGET from "../static/RENDER_TARGET"
    import {onDestroy, onMount} from "svelte";
    import updateRenderer from "../views/viewport/utils/update-renderer";
    import EngineStore from "../stores/EngineStore";
    import SettingsStore from "../stores/SettingsStore";
    import SelectionStore from "../stores/SelectionStore";
    import AssetAPI from "../lib/fs/AssetAPI";
    import initializer from "../lib/engine-tools/initializer";
    import VisualsStore from "../stores/VisualsStore";
    import Engine from "../../../public/engine/Engine";

    export let onReady

    let canvasRef = null
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
        Engine.initialize(
            canvasRef,
            {w: settings.resolution[0], h: settings.resolution[1]},
            AssetAPI.readAsset,
            AssetAPI.readMetadata,
            true
        )
            .then(async () => {
                await initializer()
                onReady()
                done = true
                EngineStore.updateStore({...engine, viewportInitialized: true})
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
