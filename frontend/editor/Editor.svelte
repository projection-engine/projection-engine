<script>
    import {onDestroy, onMount} from "svelte"
    import Viewport from "./views/viewport/Viewport.svelte"
    import Footer from "./components/footer/Footer.svelte"
    import EngineStore from "../stores/EngineStore"
    import ViewsContainer from "./components/view/Views.svelte"
    import SettingsStore from "../stores/SettingsStore"
    import FALLBACK_VIEW from "./static/FALLBACK_VIEW"
    import FileSystemUtil from "../shared/FileSystemUtil"
    import LevelService from "./services/engine/LevelService"
    import HotKeysController from "../shared/lib/HotKeysController"
    import WindowFrame from "./components/window-frame/WindowFrame.svelte"
    import Canvas from "./views/scene-editor/Canvas.svelte"
    import ToastNotificationSystem from "../shared/components/alert/ToastNotificationSystem"
    import ElectronResources from "../shared/lib/ElectronResources"
    import StoreIPCListener from "../shared/lib/StoreIPCListener"

    import IPCRoutes from "../../shared/IPCRoutes"
    import EditorUtil from "./util/EditorUtil"
    import ContentBrowserUtil from "./util/ContentBrowserUtil"
    import StorageKeys from "../../shared/StorageKeys"

    const FALLBACK = {...FALLBACK_VIEW}


    let engine
    let settings
    let isMetadataReady = false
    let isContextInitialized = false

    $: view = settings?.views?.[settings.currentView] || FALLBACK

    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)

    onMount(() => {
    	StoreIPCListener.get()
    	ToastNotificationSystem.get()
    	ElectronResources.ipcRenderer.on(IPCRoutes.EDITOR_INITIALIZATION, (_, pathToProject) => {
    		sessionStorage.setItem(StorageKeys.PROJECT_PATH, pathToProject)
    		FileSystemUtil.initializeFolders(pathToProject).catch()
    		LevelService.get(() => isMetadataReady = true)
    		HotKeysController.initializeListener()
    		ContentBrowserUtil.initializeContentBrowser()
    	})
    	ElectronResources.ipcRenderer.on("console", (_, data) => console.error(...data))
    })

    $: HotKeysController.blockActions = engine.executingAnimation
    onDestroy(() => {
    	unsubscribeSettings()
    	unsubscribeEngine()
    })
</script>

{#if isMetadataReady}
    <Canvas initializeEditor={() => isContextInitialized = true}/>
{/if}
{#if isMetadataReady && isContextInitialized}
    <WindowFrame/>
    <div class="wrapper" style={`--cube-size: ${settings.cameraGizmoSize}px;`}>
        <div class="middle">
            <ViewsContainer
                    id="left"
                    setTabs={(tabs) => EditorUtil.updateView("left", tabs)}
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
                        setTabs={(tabs) => EditorUtil.updateView("top", tabs)}
                        tabs={view.top}
                        resizePosition={"bottom"}
                        orientation={"horizontal"}
                />
                <Viewport
                        viewTab={view.viewport}
                        updateView={(viewTab) => EditorUtil.updateView("viewport", viewTab)}
                />
                <ViewsContainer
                        reducedOpacity={engine.executingAnimation}
                        id="bottom"
                        setTabs={(tabs) => EditorUtil.updateView("bottom", tabs)}
                        tabs={view.bottom}
                        resizePosition={"top"}
                        orientation={"horizontal"}
                />
            </div>
            <ViewsContainer
                    reducedOpacity={engine.executingAnimation}
                    id="right"
                    setTabs={(tabs) => EditorUtil.updateView("right", tabs)}
                    tabs={view.right}
                    orientation={"vertical"}
                    leftOffset={"0%"}
                    resizePosition={"top"}
            />
        </div>

        <Footer engine={engine} settings={settings}/>
    </div>
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