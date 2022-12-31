<script>


    import {onDestroy, onMount} from "svelte";
    import ContextMenuController from "../../lib/context-menu/ContextMenuController";
    import NodeFS from "../../lib/FS/NodeFS";
    import BASE_PATH from "../static/BASE_PATH";

    import List from "./List.svelte";
    import Header from "./Header.svelte";
    import PROJECT_STATIC_DATA from "../../../static/objects/PROJECT_STATIC_DATA";
    import ProjectRow from "./ProjectRow.svelte";
    import refreshProjects from "../utils/refresh-projects";

    const pathLib = window.require("path")
    const os = window.require("os")
    const {ipcRenderer, shell} = window.require("electron")

    let basePath
    let inputValue = ""
    let projectsToShow = []
    let currentVersion
    let selected
    let defaultVersion

    const internalID = crypto.randomUUID()

    onMount(() => {
        defaultVersion = localStorage.getItem("CURRENT_VERSION")
        currentVersion = localStorage.getItem("CURRENT_VERSION")
        ContextMenuController.mount(
            [
                {
                    icon: "delete_forever",
                    label: "Delete",
                    onClick: async () => {
                        await NodeFS.rm(NodeFS.resolvePath(localStorage.getItem(BASE_PATH) + NodeFS.sep + selected), {
                            recursive: true,
                            force: true
                        })
                        projectsToShow = projectsToShow.filter(e => e.id !== selected)
                    }
                },
                {
                    icon: "folder",
                    label: "Open in explorer",
                    onClick: async () => shell.showItemInFolder(localStorage.getItem(BASE_PATH) + NodeFS.sep + selected)
                },
            ],
            internalID,
            ["data-card"]
        )
        if (!localStorage.getItem(BASE_PATH))
            localStorage.setItem(BASE_PATH, NodeFS.rootDir)
        basePath = localStorage.getItem(BASE_PATH)

    })
    $: {
        if (basePath)
            refreshProjects(basePath).then(r => projectsToShow = r).catch()
    }
    onDestroy(() => ContextMenuController.destroy(internalID))

</script>


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
            const found = document.elementsFromPoint(e.clientX, e.clientY).map(e => e.getAttribute("data-card")).filter(e => e != null)
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
                updateVersion={async version =>  {
                        await NodeFS.write(
                            item.path + NodeFS.sep + PROJECT_STATIC_DATA.PROJECT_FILE_EXTENSION,
                         JSON.stringify({
                            ...item.meta,
                            version
                        }))
                        item.meta.version = version
                        projectsToShow = projectsToShow
                    }}
                selected={selected}
                open={() => {
                     // TODO - OPEN PROJECT
                }}
                data={item}
                onRename={async newName => {
                        const pathName = pathLib.resolve(localStorage.getItem(BASE_PATH) + NodeFS.sep + item.id + NodeFS.sep + PROJECT_STATIC_DATA.PROJECT_FILE_EXTENSION)
                        const res = await NodeFS.read(pathName)
                        if (!res)
                            return
                        await NodeFS.write(
                            pathName,
                         JSON.stringify({
                            ...JSON.parse(res.toString()),
                            name: newName
                        }))
                        projectsToShow = projectsToShow
                    }}
        />
    </List>
</div>


<style>
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