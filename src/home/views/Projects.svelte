<script>
    import Header from "../components/Header.svelte";
    import Icon from "../../shared/components/icon/Icon.svelte";
    import ROUTES from "../../static/ROUTES";
    import Localization from "../../shared/libs/Localization";
    import {onDestroy, onMount} from "svelte";
    import getBasePath from "../../../public/backend/utils/get-base-path";
    import NodeFS from "../../shared/libs/NodeFS";
    import refreshProjects from "../utils/refresh-projects";
    import FilesAPI from "../../shared/libs/files/FilesAPI";
    import ProjectRow from "../components/ProjectRow.svelte";
    import {v4} from "uuid";
    import getProjectContextMenu from "../utils/get-project-context-menu";
    import ContextMenuController from "../../shared/libs/ContextMenuController";

    const pathLib = window.require("path")
    const os = window.require("os")
    const {ipcRenderer} = window.require("electron")

    export let openProjects
    export let addOpenProjects

    let searchString = ""
    let projectsToShow = []
    let filtered = []
    const translate = (key) => Localization.HOME.HOME[key]
    const internalID = v4()

    function openProject(p) {
        ipcRenderer.send(ROUTES.OPEN_PROJECT + sessionStorage.getItem("electronWindowID"), p)
        addOpenProjects(p)
    }

    onMount(() => {
        ContextMenuController.mount(
            {
                icon: "work",
                label: Localization.HOME.HOME.LABEL_PROJECTS
            },
            getProjectContextMenu(projectsToShow, v => projectsToShow = v),
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
    <div class="content" id={internalID}>
        {#each filtered as p}
            <ProjectRow
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
        display: grid;
        gap: 2px;
        height: fit-content;
        align-items: flex-start;
        overflow: auto;
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