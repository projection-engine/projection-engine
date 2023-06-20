<script>
    import {onDestroy, onMount} from "svelte"
    import ContextMenuService from "../shared/lib/context-menu/ContextMenuService"
    import FileSystemService from "../shared/lib/FileSystemService"
    import List from "./components/List.svelte"
    import Header from "./components/Header.svelte"
    import ProjectRow from "./components/ProjectRow.svelte"
    import refreshProjects from "./utils/refresh-projects"
    import {STORAGE_KEYS} from "../shared/static/STORAGE_KEYS"

    import ToastNotificationSystem from "../shared/components/alert/ToastNotificationSystem"
    import FrameWrapper from "../shared/components/frame/FrameWrapper.svelte"
    import ElectronResources from "../shared/lib/ElectronResources"
    import IPCRoutes from "../../shared/IPCRoutes"
    import FileTypes from "../../shared/FileTypes"


    let basePath
    let inputValue = ""
    let projectsToShow = []
    let selected
    let defaultVersion

    const internalID = crypto.randomUUID()

    onMount(() => {
    	ContextMenuService.getInstance().mount([
    		{
    			icon: "delete_forever",
    			label: "Delete",
    			onClick: async () => {
    				await FileSystemService.getInstance().rm(FileSystemService.getInstance().resolvePath(localStorage.getItem(STORAGE_KEYS.ROOT_PATH) + FileSystemService.getInstance().sep + selected), {
    					recursive: true,
    					force: true
    				})
    				projectsToShow = projectsToShow.filter(e => e.id !== selected)
    			}
    		},
    		{
    			icon: "folder",
    			label: "Open in explorer",
    			onClick: async () => ElectronResources.shell.showItemInFolder(localStorage.getItem(STORAGE_KEYS.ROOT_PATH) + FileSystemService.getInstance().sep + selected)
    		},
    	],
    	internalID
    	)
    	ToastNotificationSystem.get()

    	if (!localStorage.getItem(STORAGE_KEYS.ROOT_PATH))
    		localStorage.setItem(STORAGE_KEYS.ROOT_PATH, FileSystemService.getInstance().rootDir)
    	basePath = localStorage.getItem(STORAGE_KEYS.ROOT_PATH)

    })
    $: {
    	if (basePath)
    		refreshProjects(basePath).then(r => projectsToShow = r).catch()
    }
    onDestroy(() => ContextMenuService.getInstance().destroy(internalID))

    async function onRename(newName, item) {
    	const pathName = ElectronResources.path.resolve(localStorage.getItem(STORAGE_KEYS.ROOT_PATH) + FileSystemService.getInstance().sep + item.id + FileSystemService.getInstance().sep + FileTypes.PROJECT)
    	const res = await FileSystemService.getInstance().read(pathName)
    	if (!res)
    		return
    	await FileSystemService.getInstance().write(
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
                favoriteKey={FileTypes.PROJECT}
                getID={e => e.id}
        >
            <ProjectRow

                    selected={selected}
                    open={pathToProject => ElectronResources.ipcRenderer.send(IPCRoutes.SET_PROJECT_CONTEXT, pathToProject)}
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