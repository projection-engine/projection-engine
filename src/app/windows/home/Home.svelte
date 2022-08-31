<script>
    import WindowFrame from "../../components/window-frame/WindowFrame.svelte";
    import Icon from "../../components/icon/Icon.svelte";
    import Card from "./components/Card.svelte";
    import Header from "./components/Header.svelte";
    import Recent from "./components/Recent.svelte";
    import Localization from "../../libs/Localization";
    import ROUTES from "../../../assets/ROUTES";
    import getBasePath from "../../../electron/lib/get-base-path";
    import {onMount} from "svelte";

    import refreshProjects from "./utils/refresh-projects";
    import Alert from "../../components/alert/Alert.svelte";
    import FilesAPI from "../../libs/files/FilesAPI";
    import NodeFS from "../../libs/NodeFS";

    const pathLib = window.require("path")
    const os =  window.require("os")
    const {ipcRenderer} = window.require("electron")

    let searchString = ""
    let projectsToShow = []

    const translate = (key) => Localization.HOME.HOME[key]

    function openProject(p) {
        ipcRenderer.send(ROUTES.OPEN_PROJECT+sessionStorage.getItem("electronWindowID"), p)
    }

    onMount(() => {
        const b = getBasePath(os, pathLib)
        localStorage.setItem("basePath", b)
        NodeFS.mkdir(b).catch()
        refreshProjects(b + "projects" + FilesAPI.sep).then(r => projectsToShow = r).catch()
    })

</script>


<Alert/>
<WindowFrame
    options={[]}
    label={translate("TITLE")}
    pageInfo={{
        closeEvent: true,
        minimizeEvent: true,
        maximizeEvent: true
    }}
/>
<div class="wrapper">

    <div class="wrapper-projects">
        <Header translate={translate} setSearchString={v => searchString = v} searchString={searchString} projectsToShow={projectsToShow} setProjectsToShow={v => projectsToShow = v}/>
        {#if !searchString}
            <Recent open={(p) => openProject(p)} projects={projectsToShow}/>
        {/if}
        {#if projectsToShow.length === 0}
            <div class="empty-wrapper">
                <Icon styles="font-size: 100px; color: #999;">folder</Icon>
                {translate("EMPTY")}
            </div>
        {:else}
            <div class={"content"}>
                {#each projectsToShow as p}
                    <Card
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
                                projectsToShow = [...projectsToShow]
                            }
                            }}
                        onDelete={async () => {
                            await NodeFS.rm(
                                pathLib.resolve(localStorage.getItem("basePath") + "projects" + FilesAPI.sep + p.id),
                                {recursive: true, force: true})
                            projectsToShow = projectsToShow.filter(e => e.id !== p.id)
                        }}
                    />
                {/each}
            </div>
        {/if}
    </div>
</div>


<style>
    .wrapper {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        position: relative;
        background-color: var(--pj-background-tertiary);
    }

    .wrapper-projects {
        width: 100%;
        position: relative;
        overflow-y: auto;
        height: 100%;
        padding: 16px 5% 32px;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 4px;
    }


    .title > h2 {
        margin: 0;
    }
    .content {
        display: grid;
        gap: 4px;
        height: fit-content;
        align-items: flex-start;
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