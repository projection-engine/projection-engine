<script>
    import {onMount} from "svelte";
    import ROUTES from "../backend/static/ROUTES.ts";
    import Editor from "./editor/Editor.svelte";
    import WindowUtils from "./editor/lib/WindowUtils";
    import LevelController from "./editor/lib/utils/LevelController";
    import Canvas from "./editor/views/scene-editor/Canvas.svelte";
    import RENDER_TARGET from "./static/RENDER_TARGET";
    import LOCALIZATION_EN from "./static/LOCALIZATION_EN";
    import HotKeysController from "./editor/lib/utils/HotKeysController";
    import Alert from "./components/alert/Alert.svelte";
    import About from "./components/About.svelte";
    import NodeFS from "./lib/FS/NodeFS";
    import FilesAPI from "./editor/lib/fs/FilesAPI";
    import PROJECT_STATIC_DATA from "../static/objects/PROJECT_STATIC_DATA";
    import WindowOptions from "./components/frame-options/WindowOptions.svelte";
    import ContextMenu from "./components/context-menu/ContextMenu.svelte";

    const {ipcRenderer} = window.require("electron")

    let isAboutOpen = false
    let initialized = false
    let fullyLoaded = false

    onMount(() => {
        ipcRenderer.on("project-identifier", (_, data) => {
            sessionStorage.setItem(PROJECT_STATIC_DATA.PROJECT_PATH, data)
            NodeFS.initialize()
            FilesAPI.initializeFolders().catch()
            WindowUtils.openAbout = () => isAboutOpen = true
            LevelController.initialize(() => initialized = true)
        })
        ipcRenderer.on("console", (_, data) => console.error(...data))
        ipcRenderer.once(ROUTES.OPEN_FULL, () => fullyLoaded = true)
        HotKeysController.initializeListener()
    })

</script>

<div id={RENDER_TARGET + "VIEWPORT"} style="display: none">
    {#if initialized}
        <Canvas onReady={() => LevelController.loadLevel().then(_ => ipcRenderer.send(ROUTES.OPEN_FULL))}/>
    {/if}
</div>

<WindowOptions/>
<ContextMenu/>
<Alert/>
{#if fullyLoaded}
    <Editor/>
{:else}
    <div class="wrapper">
        <img src={"./APP_LOGO.png"} alt="logo">
        <div class="title">
            <div class="label">{LOCALIZATION_EN.PROJECTION_ENGINE}</div>
            <small>{LOCALIZATION_EN.VERSION}</small>
        </div>
    </div>
{/if}
{#if isAboutOpen}
    <About handleClose={() => isAboutOpen = false}/>
{/if}

<style>
    .label {
        font-size: 1.1rem;
        font-weight: 500;
        text-align: center;
    }

    .wrapper {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        background: var(--pj-background-tertiary);

    }

    img {
        max-width: 60vw;
    }

    .title {
        display: grid;
        gap: 4px;
        justify-content: center;
        justify-items: center;
    }
</style>