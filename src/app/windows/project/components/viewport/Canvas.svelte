<script>
    import RENDER_TARGET from "../../data/RENDER_TARGET"
    import {onDestroy, onMount} from "svelte";
    import EditorRenderer from "../../libs/engine/editor/EditorRenderer";
    import updateRenderer from "./utils/update-renderer";
    import Localization from "../../../../libs/Localization";
    import EngineStore from "../../stores/EngineStore";
    import getHotkeys from "./utils/get-hotkeys";
    import bindContextTarget from "../../../../components/context-menu/libs/bind-context-target";
    import getContextMenu from "./utils/get-context-menu";
    import HotKeys from "../metrics/libs/HotKeys";
    import UserInterfaceController from "../../libs/engine/production/controllers/UserInterfaceController";
    import VIEWPORT_TABS from "../../data/VIEWPORT_TABS";
    import UIStore from "../../stores/UIStore";
    import GPU from "../../libs/engine/production/GPU";
    import SettingsStore from "../../stores/SettingsStore";
    import SelectionStore from "../../stores/SelectionStore";
    import AssetAPI from "../../../../libs/files/AssetAPI";

    export let onReady
    const TRIGGERS = ["data-viewport"]
    let canvasRef = null
    let done = false
    let engine = {}
    let settings = {}
    let uiStore = {}
    let selected = []
    const unsubscribeSelection = SelectionStore.getStore(() => selected = SelectionStore.engineSelected)
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    const unsubscribeUI = UIStore.getStore(v => uiStore = v)
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
                window.renderer = new EditorRenderer({w: settings.resolution[0], h: settings.resolution[1]})
                onReady()
                done = true
                EngineStore.updateStore({...engine, viewportInitialized: true})
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
        if (uiStore.entities.size > lastSize && renderUI && window.gpu) {
            UserInterfaceController.restart()
            lastSize = uiStore.entities.size
        }
    }
    $: {
        if (renderUI && window.gpu)
            UserInterfaceController.start()
        else
            UserInterfaceController.stop()
    }

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
