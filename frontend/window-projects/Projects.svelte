<script>
    import {onDestroy, onMount} from "svelte";
    import ContextMenuController from "../shared/lib/context-menu/ContextMenuController";
    import FS from "../shared/lib/FS/FS";
    import List from "./components/List.svelte";
    import Header from "./components/Header.svelte";
    import PROJECT_STATIC_DATA from "../../static/objects/PROJECT_STATIC_DATA";
    import ProjectRow from "./components/ProjectRow.svelte";
    import refreshProjects from "./utils/refresh-projects";
    import {STORAGE_KEYS} from "../shared/static/STORAGE_KEYS";
    import ROUTES from "../../backend/static/ROUTES";
    import AlertController from "../shared/components/alert/AlertController";
    import FrameWrapper from "../shared/components/frame/FrameWrapper.svelte";
    import Electron from "../shared/lib/Electron";


    let basePath
    let inputValue = ""
    let projectsToShow = []
    let selected
    let defaultVersion

    const internalID = crypto.randomUUID()

    onMount(() => {
        AlertController.initialize()
        ContextMenuController.initialize()
        ContextMenuController.mount([
                {
                    icon: "delete_forever",
                    label: "Delete",
                    onClick: async () => {
                        await FS.rm(FS.resolvePath(localStorage.getItem(STORAGE_KEYS.ROOT_PATH) + FS.sep + selected), {
                            recursive: true,
                            force: true
                        })
                        projectsToShow = projectsToShow.filter(e => e.id !== selected)
                    }
                },
                {
                    icon: "folder",
                    label: "Open in explorer",
                    onClick: async () => Electron.shell.showItemInFolder(localStorage.getItem(STORAGE_KEYS.ROOT_PATH) + FS.sep + selected)
                },
            ],
            internalID
        )
        if (!localStorage.getItem(STORAGE_KEYS.ROOT_PATH))
            localStorage.setItem(STORAGE_KEYS.ROOT_PATH, FS.rootDir)
        basePath = localStorage.getItem(STORAGE_KEYS.ROOT_PATH)

    })
    $: {
        if (basePath)
            refreshProjects(basePath).then(r => projectsToShow = r).catch()
    }
    onDestroy(() => ContextMenuController.destroy(internalID))

    async function onRename(newName) {
        const pathName = Electron.path.resolve(localStorage.getItem(STORAGE_KEYS.ROOT_PATH) + FS.sep + item.id + FS.sep + PROJECT_STATIC_DATA.PROJECT_FILE_EXTENSION)
        const res = await FS.read(pathName)
        if (!res)
            return
        await FS.write(
            pathName,
            JSON.stringify({
                ...JSON.parse(res.toString()),
                name: newName
            }))
        projectsToShow = projectsToShow
    }
</script>

<FrameWrapper/>
<div class="wrapper">
    <Header
            defaultVersion={defaultVersion}
            basePath={basePath}
            setBasePath={v => basePath = v}
            onChange={v => inputValue = v}
            inputValue={inputValue}
            projectsToShow={projectsToShow}
            setProjectsToShow={v => projectsToShow = v}
    />
    <div
            class="content"
            id={internalID}
            on:mousedown={e => {
                    const found = document.elementsFromPoint(e.clientX, e.clientY).map(e => e.getAttribute("data-sveltecard")).filter(e => e != null)
                    if(found != null)
                        selected = found[0]
                }}
    >
        <List
                let:item
                getLabel={e => e.meta.name}
                items={projectsToShow}
                favoriteKey={PROJECT_STATIC_DATA.PROJECT_FILE_EXTENSION}
                getID={e => e.id}
        >
            <ProjectRow

                    selected={selected}
                    open={pathToProject => Electron.ipcRenderer.send(ROUTES.SET_PROJECT_CONTEXT, pathToProject)}
                    data={item}
                    onRename={onRename}
            />
        </List>
    </div>

</div>

<style>

    .wrapper {
        padding: 16px 32px;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 4px;
        position: relative;
        background-color: var(--pj-background-tertiary);
    }

    .content {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 2px;

        align-items: flex-start;
        overflow-x: hidden;
        overflow-y: auto;
        height: 100%;
    }
</style>