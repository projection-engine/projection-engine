<script>
    import RENDER_TARGET from "./data/RENDER_TARGET"
    import {onDestroy, onMount} from "svelte";
    import updateRenderer from "./views/viewport/utils/update-renderer";
    import EngineStore from "./stores/EngineStore";
    import GPU from "../../public/engine/production/GPU";
    import SettingsStore from "./stores/SettingsStore";
    import SelectionStore from "./stores/SelectionStore";
    import AssetAPI from "../shared/libs/files/AssetAPI";
    import initializer from "../../public/engine/editor/initializer";

    export let onReady

    let canvasRef = null
    let done = false
    let engine = {}
    let settings = {}
    let selected = []
    const unsubscribeSelection = SelectionStore.getStore(() => selected = SelectionStore.engineSelected)
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
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
        unsubscribeSelection()

        unsubscribeEngine()
        unsubscribeSettings()
    })

    $: if (done) updateRenderer(selected, engine, settings)
</script>


<canvas
        data-viewport="-"
        bind:this={canvasRef}
        id={RENDER_TARGET}
        style={`width: 100%; height: 100%; background: transparent`}
        width={settings.resolution[0]}
        height={settings.resolution[1]}
></canvas>
