<script>
    import Alert from "../../components/alert/Alert.svelte";
    import WindowFrame from "../../components/window-frame/WindowFrame.svelte";
    import {onDestroy, onMount} from "svelte";
    import Viewport from "./components/viewport/Viewport.svelte";
    import InitializeWindow from "./libs/initialize-window";
    import getFrameOptions from "./utils/get-frame-options";
    import Shortcuts from "./components/metrics/Metrics.svelte";
    import Canvas from "./components/viewport/Canvas.svelte";
    import loadProjectMetadata from "./utils/load-project-metadata";
    import RendererStoreController from "./stores/RendererStoreController";
    import ViewsContainer from "../../components/view/ViewsContainer.svelte";
    import ContextMenu from "../../components/context-menu/ContextMenu.svelte";
    import ROUTES from "../../../assets/ROUTES";
    import ControlOptions from "./components/control-options/ControlOptions.svelte";

    const PAGE = {closeEvent: true, minimizeEvent: true, maximizeEvent: true}
    const {ipcRenderer} = window.require("electron")
    let engine
    let settings
    const unsubscribeEngine = RendererStoreController.getEngine(v => engine = v)
    const unsubscribeSettings = RendererStoreController.getSettings(v => settings = v)

    onDestroy(() => {
        unsubscribeSettings()
        unsubscribeEngine()
    })
    let isReady = false
    let isDataLoaded = false
    let isMetadataLoaded = false

    onMount(() => {

        ipcRenderer.on(
            ROUTES.UPDATE_SETTINGS + sessionStorage.getItem("electronWindowID"),
            (event, data) => {
                RendererStoreController.updateSettings(data)
                alert.pushAlert("Updating settings", "info")
            }
        )
        InitializeWindow()
        loadProjectMetadata((m, s) => {
            RendererStoreController.updateSettings({...settings, ...s})
            engine.meta = m
            isMetadataLoaded = true
        })
    })
    let view = {
        name: "Default",
        bottom: [],
        left: [],
        right: []
    }
    $: view = settings.views[settings.currentView]

    $: {
        if (isReady && !isDataLoaded) {
            isDataLoaded = true
            RendererStoreController.loadLevel()
        }
    }

    const updateView = (key, newView) => {
        const s = {...settings}
        const copy = [...s.views]
        copy[s.currentView] = {...view, [key]: newView}
        s.views = copy
        RendererStoreController.updateSettings(s)
    }
    $: frameOptions = getFrameOptions(engine, settings)
</script>

<div class="wrapper">
    <Alert/>
    <WindowFrame
            options={frameOptions}
            label={engine.meta?.name}
            pageInfo={PAGE}
            background="var(--pj-background-tertiary)"
    />
    <ControlOptions/>
    <ContextMenu/>
    <div class="middle">

        <ViewsContainer
                setTabs={(tabs) => updateView("left", tabs)}
                tabs={view.left}
                leftOffset={"8px"}
                orientation={"vertical"}
                resizePosition={"top"}
        />
        <div class="content">
            {#if isMetadataLoaded}
                <Viewport isReady={isReady}>
                    <Canvas
                            isExecuting={engine.executingAnimation}
                            slot="canvas"
                            onReady={() => isReady = true}
                    />
                </Viewport>
            {/if}
            <ViewsContainer
                    setTabs={(tabs) => updateView("bottom", tabs)}
                    tabs={view.bottom}
                    resizePosition={"top"}
                    orientation={"horizontal"}
            />
        </div>
        <ViewsContainer
                setTabs={(tabs) => updateView("right", tabs)}
                tabs={view.right}
                orientation={"vertical"}
                leftOffset={"0%"}
                resizePosition={"top"}
        />
    </div>
    <Shortcuts isEngineReady={isMetadataLoaded}/>
</div>


<style>
    .wrapper {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        position: relative;
        background-color: var(--pj-background-quaternary);
    }

    .content {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: var(--pj-background-quaternary);
        display: flex;
        flex-direction: column;
        user-select: none;
    }

    .middle {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;

        padding: 0 3px 3px;
    }
</style>