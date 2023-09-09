<script lang="ts">
    import {onDestroy, onMount} from "svelte"
    import Viewport from "./components/view/CentralView.svelte"
    import Footer from "./components/footer/Footer.svelte"
    import EngineStore from "../shared/stores/EngineStore"
    import ViewsContainer from "./components/view/SideView.svelte"
    import SettingsStore from "../shared/stores/SettingsStore"
    import FileSystemUtil from "../shared/FileSystemUtil"
    import EditorLevelService from "./services/engine/EditorLevelService"
    import HotKeysController from "../shared/lib/HotKeysController"
    import WindowFrame from "./components/window-frame/WindowFrame.svelte"
    import Canvas from "./views/Canvas.svelte"
    import ToastNotificationSystem from "../shared/components/alert/ToastNotificationSystem"
    import ElectronResources from "../shared/lib/ElectronResources"
    import StoreIPCListener from "../shared/lib/StoreIPCListener"
    import IPCRoutes from "../../../shared/enums/IPCRoutes"
    import EditorUtil from "./util/EditorUtil"
    import ContentBrowserUtil from "./util/ContentBrowserUtil"
    import StorageKeys from "../../../shared/enums/StorageKeys"
    import Icon from "../shared/components/icon/Icon.svelte";
    import LocalizationEN from "../../../shared/enums/LocalizationEN";
    import WindowFrameUtil from "./util/WindowFrameUtil";
    import UUIDGen from "../../../shared/UUIDGen";

    const COMPONENT_ID = UUIDGen()
    let isMetadataReady = false
    let isContextInitialized = false
    let view
    let cameraGizmoSize
    let errorInitializing = false
    let currentViewIndex = 0

    onMount(() => {
        SettingsStore.getInstance().addListener(COMPONENT_ID, data => {
            view = data.views?.[data.currentView]
            currentViewIndex = data.currentView
            cameraGizmoSize = data.cameraGizmoSize
        }, ["views", "currentView", "cameraGizmoSize"])
        EngineStore.getInstance().addListener(COMPONENT_ID, data => HotKeysController.blockActions = data.executingAnimation, ["executingAnimation"])
        StoreIPCListener.get()
        ToastNotificationSystem.get()
        ElectronResources.ipcRenderer.on(IPCRoutes.EDITOR_INITIALIZATION, (_, pathToProject) => {
            sessionStorage.setItem(StorageKeys.PROJECT_PATH, pathToProject)
            FileSystemUtil.initializeFolders(pathToProject).catch(console.error)
            EditorLevelService.get(() => isMetadataReady = true)
            HotKeysController.initializeListener()
            ContentBrowserUtil.initializeContentBrowser()
        })
    })

    onDestroy(() => {
        EngineStore.getInstance().removeListener(COMPONENT_ID)
        SettingsStore.getInstance().removeListener(COMPONENT_ID)
    })

    const initializeEditor = (success: boolean) => {
        if (success) {
            isContextInitialized = true
        } else {
            errorInitializing = true
        }
    }
</script>

{#if isMetadataReady}
    <Canvas {initializeEditor}/>
{/if}
{#if errorInitializing || !isContextInitialized}
        <div data-svelteempty="-" style="gap: 8px">
            <Icon styles="font-size: 75px">folder</Icon>
            {#if !isContextInitialized && !errorInitializing}
                {LocalizationEN.LOADING}
            {:else}
                {LocalizationEN.ERROR_INITIALIZING_PROJECT}
            {/if}
            <button data-sveltebuttondefault="-" on:click={WindowFrameUtil.closeProject}>
                {LocalizationEN.CLOSE_PROJECT}
            </button>
        </div>
{:else}
    {#if isMetadataReady && isContextInitialized && view !== undefined}
        <WindowFrame/>
        <div class="wrapper" style={`--cube-size: ${cameraGizmoSize}px;`}>
            <div class="middle">
                <ViewsContainer
                        id="left"
                        setTabs={(tabs) => EditorUtil.updateView("left", tabs)}
                        tabs={view.left}
                        leftOffset={"8px"}
                        {currentViewIndex}
                        orientation={"vertical"}
                        resizePosition={"left"}
                />
                <div class="content">
                    <ViewsContainer
                            id="bottom"
                            setTabs={(tabs) => EditorUtil.updateView("top", tabs)}
                            tabs={view.top}
                            {currentViewIndex}
                            resizePosition={"bottom"}
                            orientation={"horizontal"}
                    />
                    <Viewport
                            {currentViewIndex}
                            viewTab={view.viewport}
                            updateView={(viewTab) => EditorUtil.updateView("viewport", viewTab)}
                    />
                    <ViewsContainer
                            {currentViewIndex}
                            id="bottom"
                            setTabs={(tabs) => EditorUtil.updateView("bottom", tabs)}
                            tabs={view.bottom}
                            resizePosition={"top"}
                            orientation={"horizontal"}
                    />
                </div>
                <ViewsContainer
                        id="right"
                        {currentViewIndex}
                        setTabs={(tabs) => EditorUtil.updateView("right", tabs)}
                        tabs={view.right}
                        orientation={"vertical"}
                        leftOffset={"0%"}
                        resizePosition={"top"}
                />
            </div>

            <Footer/>
        </div>
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
