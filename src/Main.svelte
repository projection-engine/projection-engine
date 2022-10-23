<script>
    import {onMount} from "svelte";
    import ROUTES from "./data/ROUTES";
    import Editor from "./Editor.svelte";
    import InitializeWindow from "./utils/initialize-window";
    import LevelController from "./libs/LevelController";
    import About from "shared-resources/frontend/components/About.svelte";
    import logo from "shared-resources/APP_LOGO.js"
    import PROJECT_PATH from "shared-resources/PROJECT_PATH";
    import Canvas from "./components/Canvas.svelte";
    import RENDER_TARGET from "./data/RENDER_TARGET";
    import Localization from "./templates/Localization";

    const {ipcRenderer} = window.require("electron")

    let isAboutOpen = false
    let initialized = false
    let fullyLoaded = false

    onMount(() => {
        ipcRenderer.on("console", (_, data) => console.error(...data))
        ipcRenderer.once(ROUTES.OPEN_FULL, () => fullyLoaded = true)
        let interval = setInterval(() => {
            const d = sessionStorage.getItem(PROJECT_PATH)
            if (d !== null) {
                clearInterval(interval)
                InitializeWindow(_ => isAboutOpen = true)
                LevelController.initialize(() => {
                    initialized = true
                })
            }
        }, 100)
    })

</script>

<div id={RENDER_TARGET + "VIEWPORT"} style="display: none">
    {#if initialized}
        <Canvas onReady={() => LevelController.loadLevel().then(_ => ipcRenderer.send(ROUTES.OPEN_FULL))}/>
    {/if}
</div>

{#if fullyLoaded}
    <Editor/>
{:else}
    <div class="wrapper">
        <img src={logo} alt="logo">
        <div class="title">
            <div class="label">{Localization.COMPONENTS.FRAME.TITLE}</div>
            <small>{Localization.COMPONENTS.FRAME.VERSION}</small>
        </div>
    </div>
{/if}
{#if isAboutOpen}
    <About handleClose={() => isAboutOpen = false}/>
{/if}
<style>
    .label{
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
    .title{
        display: grid;
        gap: 4px;
        justify-content: center;
        justify-items: center;
    }
</style>