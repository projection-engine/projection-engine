<script>
    import RENDER_TARGET from "../../data/RENDER_TARGET"
    import {onDestroy, onMount} from "svelte";
    import updateRenderer from "./utils/update-renderer";
    import Localization from "../../../shared/libs/Localization";
    import EngineStore from "../../stores/EngineStore";
    import getHotkeys from "./utils/get-hotkeys";
    import bindContextTarget from "../../../shared/components/context-menu/libs/bind-context-target";
    import getContextMenu from "./utils/get-context-menu";
    import HotKeys from "../../components/metrics/libs/HotKeys";
    import VIEWPORT_TABS from "../../data/VIEWPORT_TABS";
    import GPU from "../../../../public/engine/production/GPU";
    import SettingsStore from "../../stores/SettingsStore";
    import SelectionStore from "../../stores/SelectionStore";
    import AssetAPI from "../../../shared/libs/files/AssetAPI";
    import initializer from "../../../../public/engine/editor/initializer";
    import {BundlerAPI} from "../../../../public/engine/production";

    export let onReady
    const TRIGGERS = ["data-viewport"]
    let canvasRef = null
    let done = false
    let engine = {}
    let settings = {}
    let selected = []
    const unsubscribeSelection = SelectionStore.getStore(() => selected = SelectionStore.engineSelected)
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    const contextMenuBinding = bindContextTarget(RENDER_TARGET, TRIGGERS)


    onMount(() => {
        contextMenuBinding.rebind(getContextMenu())
        HotKeys.bindAction(
            canvasRef,
            getHotkeys(),
            "public",
            Localization.PROJECT.VIEWPORT.TITLE
        )
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
        HotKeys.unbindAction(canvasRef)
        unsubscribeEngine()
        unsubscribeSettings()
        contextMenuBinding.onDestroy()
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
