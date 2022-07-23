<script>
    import WindowFrame from "../../components/window-frame/WindowFrame.svelte";
    import Icon from "../../components/Icon/Icon.svelte";
    import Card from "./components/Card.svelte";
    import Dropdown from "../../components/dropdown/Dropdown.svelte";
    import Input from "../../components/input/Input.svelte";
    import Recent from "./components/Recent.svelte";
    import FRAME_EVENTS from "../../../electron/static/FRAME_EVENTS";
    import EnglishLocalization from "../../static/EnglishLocalization";
    import ROUTES from "../../../electron/static/ROUTES";
    import {onMount} from "svelte";
    import loadGlobalLocalization from "../../libs/load-global-localization";
    import refreshProjects from "./utils/refresh-projects";
    import AsyncFS from "../../libs/AsyncFS";
    import FileSystem from "../../libs/FileSystem"
    import Alert from "../../components/alert/Alert.svelte";

    const pathLib = window.require("path")
    const {ipcRenderer} = window.require("electron")
    let searchString = ""
    let projectsToShow = []
    let openInput = false
    const translate = (key) => EnglishLocalization.HOME.HOME[key]

    function openProject(p) {
        ipcRenderer.send(ROUTES.SWITCH_MAIN_WINDOW, {
            windowID: p.id,
            data: p,
            hasMain: false
        })
    }

    onMount(() => {
        loadGlobalLocalization()
        let b = localStorage.getItem("basePath")
        if (localStorage.getItem("basePath") === null) {
            b = window.require("os").homedir() + pathLib.sep + "ProjectionEngineProjects" + pathLib.sep
            localStorage.setItem("basePath", b)
        }
        AsyncFS.mkdir(b).catch()
        refreshProjects(b + "projects" + FileSystem.sep).then(r => projectsToShow = r).catch()
    })
</script>


<Alert/>
<WindowFrame
        options={[]}
        label={translate("TITLE")}
        pageInfo={{
            closeEvent: FRAME_EVENTS.CLOSE_MAIN,
            minimizeEvent: FRAME_EVENTS.MINIMIZE_MAIN,
            maximizeEvent:FRAME_EVENTS.MAXIMIZE_MAIN
        }}
/>
<div class={"wrapper"}>
    <div class={"wrapperProjects"}>
        <div class={"titleWrapper"}>
            <div class={"title"}>
                <h2>{translate("PROJECTS")}</h2>
                <Input placeholder={translate("SEARCH")} height={"25px"} setSearchString={v => searchString = v}
                       searchString={searchString}>
                    <Icon slot="icon" styles="font-size: 1rem">
                        search
                    </Icon>
                </Input>
            </div>

            <div class="input-creation">
                {#if openInput}
                    <Input
                        placeholder={translate("CREATE")}
                        onEnter={async (name) => {
                            const res = await FileSystem.createProject(name)
                            projectsToShow = [
                                ...projectsToShow,
                                {
                                    id: res,
                                    meta: {name: name}
                                }
                            ]
                            openInput = false
                            alert.pushAlert(translate("PROJECT_CREATED"), "success")
                        }}
                        onBlur={(changed) =>{
                            if(!changed)
                                openInput = false
                        }}
                        height={"25px"}
                    />
                {/if}
                <button on:click={() => openInput = !openInput} class="button-create" style="width: {openInput ? "25px" : "initial"}; padding: {openInput ? "0px" : "4px 8px"}; justify-content: {openInput ? "center" : "initial"}">
                    {#if !openInput}
                        <Icon styles="font-size: 1.1rem">add</Icon>
                        {translate("CREATE")}
                        {:else}
                        <Icon styles="font-size: 1.1rem">navigate_next</Icon>
                    {/if}
                </button>
            </div>

        </div>
        {#if !searchString}
            <Recent open={(p) => openProject(p)} projects={projectsToShow}/>
        {/if}
        {#if projectsToShow.length === 0}
            <div class={"emptyWrapper"}>
                <Icon styles="font-size: 100px">folder</Icon>
                {translate("EMPTY")}
            </div>
        {:else}
            <div class={"content"}>
                {#each projectsToShow as p, index}
                    <Card
                        open={() => openProject(p)}
                        data={p}
                        index={index}
                        onRename={async newName => {
                            const pathName = pathLib.resolve(localStorage.getItem("basePath") + "projects" + FileSystem.sep + p.id + FileSystem.sep + ".meta")
                            const [error, res] = await AsyncFS.read(pathName)
                            if (res && !error)
                                await AsyncFS.write(pathName, JSON.stringify({
                                    ...JSON.parse(res),
                                    name: newName
                                }))
                            }}
                        onDelete={async () => {
                            console.log(p)
                            await AsyncFS.rm(
                                pathLib.resolve(localStorage.getItem("basePath") + "projects" + FileSystem.sep + p.id),
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
    .button-create {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        font-size: .75rem;
        height: 25px;
    }

    .wrapper {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        position: relative;
        background-color: var(--pj-background-primary);
    }

    .wrapperProjects {
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

    .titleWrapper {
        color: var(--pj-color-secondary);
        border-bottom: var(--pj-border-primary) 2px solid;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 8px;

        overflow: hidden;
        max-width: 100%;
    }

    .title {
        display: flex;
        align-items: center;
        gap: 16px;
        white-space: nowrap;
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

    .input-creation{
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .emptyWrapper {
        color: var(--pj-color-tertiary);
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