<script>
    import WindowFrame from "../shared/components/window-frame/WindowFrame.svelte";
    import Localization from "../shared/libs/Localization";
    import Alert from "../shared/components/alert/Alert.svelte";
    import Sidebar from "../shared/components/Sidebar.svelte";
    import Projects from "./views/Projects.svelte";
    import ReleasesList from "./views/ReleasesList.svelte";
    import ResizableBar from "../shared/components/resizable/ResizableBar.svelte";
    import ContextMenu from "../shared/components/context-menu/ContextMenu.svelte";
    import {onMount} from "svelte";
    import ROUTES from "../static/ROUTES";
    import OPEN_PROJECTS from "../static/OPEN_PROJECTS"
    import FilesAPI from "../shared/libs/files/FilesAPI";

    const {ipcRenderer} = require('electron')
    let tab = 0
    let isWindowFocused
    let openProjects = []
    let initialized = false

    const translate = (key) => Localization.HOME.HOME[key]
    onMount(() => {
        ipcRenderer.on(ROUTES.HOME_WINDOW_FOCUS + sessionStorage.getItem("electronWindowID"), (event, data) => {
            isWindowFocused = data
        })
        ipcRenderer.on(ROUTES.WINDOW_CLOSED + sessionStorage.getItem("electronWindowID"), () => {
            readOpenProjects()
        })
    })

    async function readOpenProjects() {
        const pathToProjects = localStorage.getItem("basePath")
        const res = await FilesAPI.readFile(pathToProjects + FilesAPI.sep + OPEN_PROJECTS, "json")
        console.log(res)
        if (res)
            openProjects = res
        else
            openProjects = []
    }

    $: {
        if (isWindowFocused || !initialized) {
            if(!initialized)
                initialized = true
            readOpenProjects()
        }
    }
</script>


<Alert/>
<WindowFrame
        background="var(--pj-background-quaternary)"
        options={[]}
        label={translate("TITLE")}
        pageInfo={{
        closeEvent: true,
        minimizeEvent: true,
        maximizeEvent: true
    }}
/>
<ContextMenu/>
<div class="wrapper">
    <Sidebar tab={tab} setTab={v => tab = v} options={[
        ["view_in_ar", translate("PROJECTS")],
        ["inventory_2", translate("RELEASES")]
    ]}/>
    <ResizableBar type="width"/>
    <div class="tab">
        {#if tab === 0}
            <Projects openProjects={openProjects} addOpenProjects={id => openProjects.push(id)}/>
        {:else}
            <ReleasesList/>
        {/if}
    </div>
</div>


<style>
    .tab {
        width: 100%;
        position: relative;
        overflow: hidden;
        height: 100%;
        padding: 16px 5% 32px;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 4px;
    }

    .wrapper {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        display: flex;
        position: relative;
        background-color: var(--pj-background-tertiary);
    }


</style>