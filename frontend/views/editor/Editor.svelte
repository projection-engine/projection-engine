<script>
    import {onDestroy, onMount} from "svelte";
    import Viewport from "./views/viewport/Viewport.svelte";
    import Footer from "../../components/footer/Footer.svelte";
    import EngineStore from "./stores/EngineStore";
    import ViewsContainer from "../../components/view/Views.svelte";
    import SettingsStore from "./stores/SettingsStore";
    import FALLBACK_VIEW from "./static/FALLBACK_VIEW";
    import About from "../../components/About.svelte";
    import WindowUtils from "./lib/WindowUtils";
    import updateView from "./utils/update-view";
    import FS from "../../lib/FS/FS";
    import FilesAPI from "./lib/fs/FilesAPI";
    import LevelController from "./lib/utils/LevelController";
    import HotKeysController from "./lib/utils/HotKeysController";
    import WindowFrame from "../../components/window-frame/WindowFrame.svelte";
    import Canvas from "./views/scene-editor/Canvas.svelte";
    import ROUTES from "../../../backend/static/ROUTES";
    import {STORAGE_KEYS} from "../../static/STORAGE_KEYS";
    import ContextMenu from "../../components/context-menu/ContextMenu.svelte";
    import Alert from "../../components/alert/Alert.svelte";
    import FilesStore from "./stores/FilesStore";

    const {ipcRenderer} = window.require("electron")
    const FALLBACK = {...FALLBACK_VIEW}


    let engine
    let settings
    let aboutModalIsOpen = false
    let isMetadataReady = false
    let isContextInitialized = false

    $: view = settings?.views?.[settings.currentView] || FALLBACK

    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)

    onMount(() => {
        ipcRenderer.on(ROUTES.EDITOR_INITIALIZATION, (_, pathToProject) => {
            sessionStorage.setItem(STORAGE_KEYS.PROJECT_PATH, pathToProject)
            WindowUtils.openAbout = () => aboutModalIsOpen = true
            FS.initialize(pathToProject)
            FilesAPI.initializeFolders().catch()
            LevelController.initialize().then(_ => isMetadataReady = true).catch()
            HotKeysController.initializeListener()
            FilesStore.initializeContentBrowser()
        })
        ipcRenderer.on("console", (_, data) => console.error(...data))
    })

    onDestroy(() => {
        unsubscribeSettings()
        unsubscribeEngine()
    })
</script>
<ContextMenu/>
<Alert/>
{#if isMetadataReady}
    <Canvas initializeEditor={() => isContextInitialized = true}/>
{/if}
{#if isMetadataReady && isContextInitialized}

    <WindowFrame/>
    <div class="wrapper" style={`--cube-size: ${settings.cameraGizmoSize}px;`}>
        <div class="middle">
            <ViewsContainer
                    id="left"
                    setTabs={(tabs) => updateView("left", tabs)}
                    tabs={view.left}
                    reducedOpacity={engine.executingAnimation}
                    leftOffset={"8px"}
                    orientation={"vertical"}
                    resizePosition={"left"}
            />
            <div class="content">
                <ViewsContainer
                        reducedOpacity={engine.executingAnimation}
                        id="bottom"
                        setTabs={(tabs) => updateView("top", tabs)}
                        tabs={view.top}
                        resizePosition={"bottom"}
                        orientation={"horizontal"}
                />
                <Viewport
                        viewTab={view.viewport}
                        updateView={(viewTab) => updateView("viewport", viewTab)}
                />
                <ViewsContainer
                        reducedOpacity={engine.executingAnimation}
                        id="bottom"
                        setTabs={(tabs) => updateView("bottom", tabs)}
                        tabs={view.bottom}
                        resizePosition={"top"}
                        orientation={"horizontal"}
                />
            </div>
            <ViewsContainer
                    reducedOpacity={engine.executingAnimation}
                    id="right"
                    setTabs={(tabs) => updateView("right", tabs)}
                    tabs={view.right}
                    orientation={"vertical"}
                    leftOffset={"0%"}
                    resizePosition={"top"}
            />
        </div>

        <Footer engine={engine} settings={settings}/>
    </div>
    {#if aboutModalIsOpen}
        <About handleClose={() => aboutModalIsOpen = false}/>
    {/if}
{/if}


<style>
    .wrapper {
        background: var(--pj-background-secondary);
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        position: relative;
    }

    .content {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        user-select: none;
    }

    .middle {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;

    }
</style>