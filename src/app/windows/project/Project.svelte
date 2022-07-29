<script>
    import Alert from "../../components/alert/Alert.svelte";
    import WindowFrame from "../../components/window-frame/WindowFrame.svelte";
    import {onDestroy, onMount} from "svelte";
    import loadProject from "./utils/load-project";
    import Viewport from "./views/viewport/Viewport.svelte";
    import InitializeWindow from "./libs/initialize-window";
    import {ENTITY_ACTIONS} from "./libs/engine-extension/entityReducer";
    import getFrameOptions from "./utils/get-frame-options";
    import Shortcuts from "./views/shortcuts/Shortcuts.svelte";
    import Canvas from "./views/viewport/Canvas.svelte";
    import loadProjectMetadata from "./utils/load-project-metadata";
    import parseEntityObject from "./utils/parse-entity-object";
    import DataStoreController from "./stores/DataStoreController";
    import ViewsContainer from "../../components/view/ViewsContainer.svelte";
    import ContextMenu from "../../components/context-menu/ContextMenu.svelte";

    const {ipcRenderer} = window.require("electron")

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
        if (isMetadataLoaded && settings.views[settings.currentView])
            view = settings.views[settings.currentView]

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

                     engine.dispatchEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: mapped})
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
    <div class="content">
        <div class="middle">
<!--            <ViewsContainer-->
<!--                    setTabs={(tabs) => updateView("bottom", tabs)}-->
<!--                    tabs={view.bottom}-->
<!--                    resizePosition={"top"}-->
<!--                    orientation={"horizontal"}-->
<!--            />-->
            {#if isMetadataLoaded}
                <Viewport isReady={isReady}>
                    <Canvas
                            slot="canvas"
                            onReady={() => {
                            isReady = true
                            console.log("IM HERE")
                        }}
                    />
                </Viewport>
            {/if}
            <ViewsContainer
                setTabs={(tabs) => updateView("right", tabs)}
                tabs={view.right}
                orientation={"vertical"}
                leftOffset={"0%"}
                resizePosition={"top"}
            />
        </div>
        <ViewsContainer
                setTabs={(tabs) => updateView("bottom", tabs)}
                tabs={view.bottom}
                resizePosition={"top"}
                orientation={"horizontal"}
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
        background-color: var(--pj-background-primary);
    }

    .content {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: var(--pj-background-quaternary);
        display: flex;
        flex-direction: column;
        padding: 3px;
        user-select: none;
    }

    .middle {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
    }
</style>