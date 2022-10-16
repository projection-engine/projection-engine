<script>
    import RENDER_TARGET from "../data/RENDER_TARGET"
    import {onDestroy, onMount} from "svelte";
    import updateRenderer from "../views/viewport/utils/update-renderer";
    import EngineStore from "../stores/EngineStore";
    import GPU from "../../public/engine/production/GPU";
    import SettingsStore from "../stores/SettingsStore";
    import SelectionStore from "../stores/SelectionStore";
    import AssetAPI from "../libs/AssetAPI";
    import initializer from "../../public/engine/editor/initializer";
    import VisualsStore from "../stores/VisualsStore";

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
        GPU.initializeContext(canvasRef, settings.resolution, AssetAPI.readAsset)
            .then(() => {
                initializer()
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
