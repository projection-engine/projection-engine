<script>

    import {onDestroy, onMount} from "svelte";
    import CreateProject from "./CreateProject.svelte";
    import LOCALIZATION_EN from "../../shared/static/LOCALIZATION_EN";
    import {STORAGE_KEYS} from "../../shared/static/STORAGE_KEYS";
    import Portal from "../../shared/lib/Portal";
    import Icon from "../../shared/components/icon/Icon.svelte";
    import ToolTip from "../../shared/components/tooltip/ToolTip.svelte";
    import ElectronResources from "../../shared/lib/ElectronResources";
    import ROUTES from "../../../backend/static/ROUTES";


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
        ElectronResources.ipcRenderer.on(ROUTES.OPEN_SELECTION, (event, data) => {
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
        <div data-sveltevertdivider="-"></div>
        <small style="font-size: .7rem">{basePath}</small>
        <button data-sveltebuttondefault="-"
                class="settings-button"
                on:click={() => ElectronResources.ipcRenderer.send(ROUTES.OPEN_SELECTION)}
        >
            <Icon styles="font-size: .9rem">settings</Icon>
            <ToolTip content={LOCALIZATION_EN.CHANGE_BASE_DIR}/>
        </button>

    </div>

    <button data-sveltebuttondefault="-"
            on:click={() => openInput = true}
            data-svelteoverflow="-"
            data-sveltefocusbutton="-"
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