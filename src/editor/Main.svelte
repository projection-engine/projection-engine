<script>
    import {onMount} from "svelte";
    import ROUTES from "../static/ROUTES";
    import Editor from "./Editor.svelte";
    import InitializeWindow from "./libs/initialize-window";
    import LevelController from "./libs/LevelController";
    import About from "shared-resources/frontend/components/About.svelte";
    import logo from "shared-resources/APP_LOGO.png"
    import PROJECT_PATH from "shared-resources/PROJECT_PATH";
    import {GPU} from "../../public/engine/production";
    import Canvas from "./components/Canvas.svelte";
    import RENDER_TARGET from "./data/RENDER_TARGET";

    const {ipcRenderer} = window.require("electron")

    let isAboutOpen = false
    let initialized = false
    let fullyLoaded =false


    onMount(() => {
        ipcRenderer.once(ROUTES.OPEN_FULL, () => {
            fullyLoaded = true
        })
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
    </div>
{/if}
{#if isAboutOpen}
    <About handleClose={() => isAboutOpen = false}/>
{/if}
<style>
    .wrapper {
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;

        background: var(--pj-background-tertiary);
    }

    img {
        max-height: 100%;
    }
</style>