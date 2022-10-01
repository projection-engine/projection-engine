<script>
    import Header from "../components/Header.svelte";
    import Icon from "../../shared/components/icon/Icon.svelte";
    import ROUTES from "../../static/ROUTES";
    import Localization from "../../shared/libs/Localization";
    import {onDestroy, onMount} from "svelte";
    import getBasePath from "../../../public/backend/utils/get-base-path";
    import NodeFS from "../../shared/libs/NodeFS";
    import refreshProjects from "../utils/refresh-projects";
    import FilesAPI from "../../shared/libs/FilesAPI";
    import ProjectRow from "../components/ProjectRow.svelte";
    import {v4} from "uuid";
    import ContextMenuController from "../../shared/libs/ContextMenuController";

    const pathLib = window.require("path")
    const os = window.require("os")
    const {ipcRenderer, shell} = window.require("electron")

    export let openProjects
    export let addOpenProjects

    let searchString = ""
    let projectsToShow = []
    let filtered = []
    const translate = (key) => Localization.HOME.HOME[key]
    const internalID = v4()

    let selected

    function openProject(p) {
        ipcRenderer.send(ROUTES.OPEN_PROJECT + sessionStorage.getItem("electronWindowID"), p)
        addOpenProjects(p)
    }

    onMount(() => {
        ContextMenuController.mount(
            {
                icon: "view_in_ar",
                label: Localization.HOME.HOME.LABEL_PROJECTS
            },
            [
                {
                    icon: "delete_forever",
                    label: "Delete",
                    onClick: async () => {
                        await NodeFS.rm(FilesAPI.resolvePath(localStorage.getItem("basePath") + "projects" + FilesAPI.sep + selected), {recursive: true, force: true})
                        projectsToShow = projectsToShow.filter(e => e.id !== selected)
                    }
                },
                {
                    icon: "folder",
                    label: "Open in explorer",
                    onClick: async () => shell.showItemInFolder(localStorage.getItem("basePath") + "projects" + FilesAPI.sep + selected)
                },
            ],
            internalID,
            ["data-card"]
        )
        const b = getBasePath(os, pathLib)
        localStorage.setItem("basePath", b)
        NodeFS.mkdir(b).catch()
        refreshProjects(b + "projects" + FilesAPI.sep).then(r => projectsToShow = r).catch()
    })
    onDestroy(() => ContextMenuController.destroy(internalID))
    $: {
        if (searchString)
            filtered = projectsToShow.filter(p => p.meta.name && p.meta.name.toLowerCase().includes(searchString.toLowerCase()))
        else
            filtered = [...projectsToShow]
    }
</script>


<Header
        translate={translate}
        setSearchString={v => searchString = v}
        searchString={searchString}
        projectsToShow={projectsToShow}
        setProjectsToShow={v => projectsToShow = v}
/>
{#if filtered.length === 0}
    <div class="empty-wrapper">
        <Icon styles="font-size: 100px; color: #999;">folder</Icon>
        {translate("EMPTY")}
    </div>
{:else}
    <div
            class="content"
            id={internalID}
            on:mousedown={e => {

                const found = document.elementsFromPoint(e.clientX, e.clientY).map(e => e.getAttribute("data-card")).filter(e => e != null)

                if(found != null)
                    selected = found[0]
            }}
    >
        {#each filtered as p}
            <ProjectRow
                    selected={selected}
                    openProjects={openProjects}
                    open={() => openProject(p)}
                    data={p}
                    onRename={async newName => {
                        const pathName = pathLib.resolve(localStorage.getItem("basePath") + "projects" + FilesAPI.sep + p.id + FilesAPI.sep + ".meta")
                        const [error, res] = await NodeFS.read(pathName)
                        if (res && !error){

                            await NodeFS.write(pathName, JSON.stringify({
                                ...JSON.parse(res),
                                name: newName
                            }))
                            projectsToShow = projectsToShow
                        }
                    }}

            />
        {/each}
    </div>
{/if}


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

    .empty-wrapper {
        color: #999 !important;
        display: grid;
        justify-content: center;
        justify-items: center;
        width: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-weight: 550;
        font-size: 0.8rem;
    }

</style>