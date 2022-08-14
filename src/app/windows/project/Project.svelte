<script>
    import Alert from "../../components/alert/Alert.svelte";
    import WindowFrame from "../../components/window-frame/WindowFrame.svelte";
    import {onDestroy, onMount} from "svelte";
    import loadProject from "./utils/load-project";
    import Viewport from "./views/viewport/Viewport.svelte";
    import InitializeWindow from "./libs/initialize-window";
    import dispatchEntities, {ENTITY_ACTIONS} from "./stores/dispatch-entities";
    import getFrameOptions from "./utils/get-frame-options";
    import Shortcuts from "./views/metrics/Metrics.svelte";
    import Canvas from "./views/viewport/Canvas.svelte";
    import loadProjectMetadata from "./utils/load-project-metadata";
    import parseEntityObject from "./utils/parse-entity-object";
    import DataStoreController from "./stores/DataStoreController";
    import ViewsContainer from "../../components/view/ViewsContainer.svelte";
    import ContextMenu from "../../components/context-menu/ContextMenu.svelte";
    import ROUTES from "../../../assets/ROUTES";
    import VIEWS from "../../components/view/VIEWS";


    const {ipcRenderer} = window.require("electron")

    const EXECUTION_VIEW = {
        name: "Default",
        bottom: [VIEWS.CONSOLE],
        left: [],
        right: []
    }
    let engine
    let settings
    const unsubscribeEngine = DataStoreController.getEngine(v => engine = v)
    const unsubscribeSettings = DataStoreController.getSettings(v => settings = v)

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
                DataStoreController.updateSettings(data)
                alert.pushAlert("Updating settings", "info")
            }
        )
        InitializeWindow()
        loadProjectMetadata((m, s) => {
            DataStoreController.updateSettings({...settings, ...s})
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
    $: {
        if (engine.executingAnimation)
            view = EXECUTION_VIEW
        else if (isMetadataLoaded && settings.views[settings.currentView])
            view = settings.views[settings.currentView]
    }
    $: {


        if (isReady && !isDataLoaded) {
            isDataLoaded = true
            loadProject(
                mesh => {
                    engine.meshes.set(mesh.id, mesh)
                    DataStoreController.updateEngine(engine)
                },
                async entities => {

                    const mapped = []
                    for (let i = 0; i < entities.length; i++) {
                        mapped.push(await parseEntityObject(entities[i].data))
                    }

                    dispatchEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: mapped})
                },
                material => {
                    engine.materials.push(material)
                    DataStoreController.updateEngine(engine)
                })
        }

    }

    const updateView = (key, newView) => {
        const s = {...settings}
        const copy = [...s.views]
        copy[s.currentView] = {...view, [key]: newView}
        s.views = copy
        DataStoreController.updateSettings(s)
    }
    $: frameOptions = getFrameOptions(engine, settings)
</script>

<div class="wrapper">
    <Alert/>
    <WindowFrame
            options={frameOptions}
            label={engine.meta?.name}
            pageInfo={{
        closeEvent: true,
        minimizeEvent: true,
        maximizeEvent: true
    }}
    />
    <ContextMenu/>
    <div class="middle">

        <ViewsContainer
                overlay={engine.executingAnimation}
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
                    overlay={engine.executingAnimation}
                    setTabs={(tabs) => updateView("bottom", tabs)}
                    tabs={view.bottom}
                    resizePosition={"top"}
                    orientation={"horizontal"}
            />
        </div>
        <ViewsContainer
                overlay={engine.executingAnimation}
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

        padding: 3px;
    }
</style>