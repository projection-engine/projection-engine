<script>

    import {onDestroy, onMount} from "svelte";
    import CreateProject from "./CreateProject.svelte";
    import LOCALIZATION_EN from "../../editor/static/LOCALIZATION_EN";
    import {STORAGE_KEYS} from "../../../static/STORAGE_KEYS";
    import Portal from "../../../lib/Portal";
    import Icon from "../../../components/icon/Icon.svelte";
    import ToolTip from "../../../components/tooltip/ToolTip.svelte";

    const {ipcRenderer} = window.require("electron")


    export let setProjectsToShow
    export let projectsToShow
    export let onChange
    export let inputValue
    export let setBasePath
    export let basePath

    let openInput = false
    let modal

    function handler(event) {
        if (!modal.firstChild.contains(event.target))
            openInput = false
    }

    const portal = new Portal(999)
    $: openInput ? portal.open() : portal.close()

    onMount(() => {

        portal.create(modal, {backdropFilter: "blur(2px)"})
        document.addEventListener("mousedown", handler)
        ipcRenderer.on("open-selection", (event, data) => {
            if (data != null)
                setBasePath(data)
            localStorage.setItem(STORAGE_KEYS.ROOT_PATH, data)
        })
    })
    onDestroy(() => {
        portal.destroy()
        document.removeEventListener("mousedown", handler)
    })


</script>


<div class="wrapper">
    <div class="left-content">
        <div class="header">{LOCALIZATION_EN.PROJECTS}</div>
        <div data-vertdivider="-"></div>
        <small style="font-size: .7rem">{basePath}</small>
        <button
                class="settings-button"
                on:click={() => ipcRenderer.send("open-selection")}
        >
            <Icon styles="font-size: .9rem">settings</Icon>
            <ToolTip content={LOCALIZATION_EN.CHANGE_BASE_DIR}/>
        </button>

    </div>

    <button
            on:click={() => openInput = true}
            data-overflow="-"
            data-focusbutton="-"
            style="height: 25px"
    >
        <Icon>add</Icon>
        {LOCALIZATION_EN.CREATE}
    </button>
</div>
<div bind:this={modal} class="modal">
    <div class="container">

        <CreateProject
                setProjectsToShow={setProjectsToShow}
                projectsToShow={projectsToShow}
                close={() => openInput = false}
        />
    </div>
</div>

<style>
    .settings-button {
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .left-content {
        display: flex;
        align-items: center;
        gap: 2px;
    }

    .wrapper {
        height: clamp(50px, 7vh, 100px);
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
        max-width: 100%;
    }

    .header {
        font-weight: 550;
        font-size: 1.5rem;
    }


    .container {
        width: 50vw;
        height: fit-content;

        background-color: var(--pj-background-secondary);
        border: var(--pj-border-primary) 1px solid;
        border-radius: 3px;
        box-shadow: var(--pj-boxshadow);
        color: var(--pj-color-secondary);
    }


    .modal {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100vw;
        height: 100vh;

        position: fixed;
        z-index: 999;
    }


</style>