<script>
    import {onMount} from "svelte";
    import ROUTES from "../backend/static/ROUTES.ts";
    import Editor from "./editor/Editor.svelte";
    import Alert from "./components/alert/Alert.svelte";
    import FS from "./lib/FS/FS";
    import PROJECT_STATIC_DATA from "../static/objects/PROJECT_STATIC_DATA";
    import WindowOptions from "./components/window-frame/WindowFrame.svelte";
    import ContextMenu from "./components/context-menu/ContextMenu.svelte";
    import {WINDOWS} from "./static/WINDOWS";
    import {STORAGE_KEYS} from "./static/STORAGE_KEYS";
    import Projects from "./projects/Projects.svelte";
    import EngineStore from "./editor/stores/EngineStore";

    const {ipcRenderer} = window.require("electron")

    let openWindow = WINDOWS.PROJECTS
    let openProjectPath

    onMount(() => {
        const lastOpenProject = localStorage.getItem(STORAGE_KEYS.LAST_OPEN_PROJECT)
        const blockCacheOpening = localStorage.getItem(STORAGE_KEYS.BLOCK_CACHE_OPENING)
        if (!blockCacheOpening && lastOpenProject && FS.exists(lastOpenProject + FS.sep + PROJECT_STATIC_DATA.PROJECT_FILE_EXTENSION)) {
            openWindow = WINDOWS.EDITOR
            ipcRenderer.send(ROUTES.SET_PROJECT_CONTEXT, lastOpenProject)
            openProjectPath = lastOpenProject
        }
        ipcRenderer.on(ROUTES.CAN_INITIALIZE_PROJECT, () => {
            openWindow = WINDOWS.EDITOR
        })
    })
    $: {

        if (openProjectPath) {
            console.trace(openProjectPath)
            ipcRenderer.send(ROUTES.SET_PROJECT_CONTEXT, openProjectPath)
            sessionStorage?.setItem?.(STORAGE_KEYS.PROJECT_PATH, openProjectPath)

        } else
            openWindow = WINDOWS.PROJECTS
    }
</script>



<ContextMenu/>
<Alert/>

{#if openProjectPath}
    <Editor pathToProject={openProjectPath} closeProject={() => openProjectPath = undefined}/>
{:else}
    <Projects openProject={path => openProjectPath = path}/>
{/if}
