<script>
    import RENDER_TARGET from "../../static/misc/RENDER_TARGET";
    import {onDestroy, onMount} from "svelte";
    import EditorRenderer from "../../libs/engine-extension/EditorRenderer";
    import updateRenderer from "./utils/update-renderer";
    import Localization from "../../../../libs/Localization";
    import DataStoreController from "../../stores/DataStoreController";
    import getHotkeys from "./utils/get-hotkeys";
    import bindContextTarget from "../../../../components/context-menu/libs/bind-context-target";
    import getContextMenu from "./utils/get-context-menu";
    import Packager from "../../libs/engine/libs/builder/Packager";
    import HotKeys from "../metrics/libs/HotKeys";

    export let onReady
    export let isExecuting

    const TRIGGERS = ["data-viewport"]
    let canvasRef = null
    let done = false
    let engine = {}
    let settings = {}
    const unsubscribeEngine = DataStoreController.getEngine(v => engine = v)
    const unsubscribeSettings = DataStoreController.getSettings(v => settings = v)

    const contextMenuBinding = bindContextTarget(RENDER_TARGET, TRIGGERS)
    $: contextMenuBinding.rebind(getContextMenu(engine))

    onMount(() => {
        HotKeys.bindAction(
            canvasRef,
            getHotkeys(),
            "window",
            Localization.PROJECT.VIEWPORT.TITLE
        )
        Packager.buildWindow(canvasRef, window.imageWorker)
            .then(() => {
                window.renderer = new EditorRenderer({w: settings.resolution[0], h: settings.resolution[1]})
                onReady()
                done = true
                DataStoreController.updateEngine({...engine, viewportInitialized: true})
            })
    })

    onDestroy(() => {
        HotKeys.unbindAction(canvasRef)
        unsubscribeEngine()
        unsubscribeSettings()
        contextMenuBinding.onDestroy()
    })

    $: if (done) updateRenderer(engine, settings)
</script>

<canvas
        data-viewport="-"
        bind:this={canvasRef}
        id={RENDER_TARGET}
        style={`width: ${settings.visible.sideBarViewport && !isExecuting ? "calc(100% - 23px)" : "100%"}; height: 100%; background: transparent`}
        width={settings.resolution[0]}
        height={settings.resolution[1]}
></canvas>