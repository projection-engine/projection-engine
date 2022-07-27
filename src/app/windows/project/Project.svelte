<script>

    import Alert from "../../components/alert/Alert.svelte";
    import WindowFrame from "../../components/window-frame/WindowFrame.svelte";
    import {onDestroy, onMount} from "svelte";
    import SETTINGS from "./static/misc/SETTINGS";
    import loadProject from "./utils/load-project";
    import Viewport from "./components/viewport/Viewport.svelte";
    import InitializeWindow from "./libs/initialize-window";
    import entityReducer, {ENTITY_ACTIONS} from "./libs/engine-extension/entityReducer";

    import getFrameOptions from "./utils/get-frame-options";
    import Shortcuts from "./components/shortcuts/Shortcuts.svelte";
    import Canvas from "./components/viewport/Canvas.svelte";
    import loadProjectMetadata from "./utils/load-project-metadata";
    import parseEntityObject from "./utils/parse-entity-object";
    import StoreController from "./stores/StoreController";
    import ViewsContainer from "../../components/view/ViewsContainer.svelte";

    const {ipcRenderer} = window.require("electron")

    let engine
    let settings
    const unsubscribeEngine = StoreController.getEngine(v => engine = v)
    const unsubscribeSettings = StoreController.getSettings(v => settings = v)
    onDestroy(() => {
        unsubscribeSettings()
        unsubscribeEngine()
    })
    let isReady = false
    let isDataLoaded = false
    let isMetadataLoaded = false

    onMount(() => {
        InitializeWindow()
        StoreController.updateEngine({
            ...engine,
            dispatchEntities: packageData => entityReducer(packageData, engine.entities, id => {
                StoreController.updateEngine({
                    ...engine,
                    changeID: id
                })
            })

        })
        loadProjectMetadata((m, s) => {
            StoreController.updateSettings({...settings, ...s})
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
                    StoreController.updateEngine(engine)
                },
                async entities => {
                    const mapped = []
                    for (let i = 0; i < entities.length; i++) {
                        mapped.push(await parseEntityObject(entities))
                    }
                    engine.dispatchEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: mapped})
                },
                material => {
                    engine.materials.push(material)
                    StoreController.updateEngine(engine)
                })
        }
    }



    const updateView = (key, newView) => {
        const s = {...settings}
        const copy = [...s.views]
        copy[s.currentView] = {...view, [key]: newView}
        s.views = copy
        StoreController.updateSettings(s)
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
<!--            <ViewsContainer-->
<!--                    setTabs={(tabs) => updateView("bottom", tabs)}-->
<!--                    tabs={view.bottom}-->
<!--                    resizePosition={"top"}-->
<!--                    orientation={"horizontal"}-->
<!--            />-->
        </div>
        <ViewsContainer
                setTabs={(tabs) => updateView("bottom", tabs)}
                tabs={view.bottom}
                resizePosition={"top"}
                orientation={"horizontal"}
        />
    </div>
    <Shortcuts/>
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