<script>
    import {onDestroy, onMount} from "svelte"
    import ContextMenuService from "../shared/lib/context-menu/ContextMenuService"
    import List from "./components/List.svelte"
    import Header from "./components/Header.svelte"
    import ProjectRow from "./components/ProjectRow.svelte"
    import refreshProjects from "./utils/refresh-projects"

    import ToastNotificationSystem from "../shared/components/alert/ToastNotificationSystem"
    import FrameWrapper from "../shared/components/frame/FrameWrapper.svelte"
    import ElectronResources from "../shared/lib/ElectronResources"
    import IPCRoutes from "../../../shared/enums/IPCRoutes"
    import FileTypes from "../../../shared/enums/FileTypes"
    import FileSystemUtil from "../shared/FileSystemUtil"
    import StorageKeys from "../../../shared/enums/StorageKeys"


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
    				await FileSystemUtil.rm(FileSystemUtil.resolvePath(localStorage.getItem(StorageKeys.ROOT_PATH) + FileSystemUtil.sep + selected), {
    					recursive: true,
    					force: true
    				})
    				projectsToShow = projectsToShow.filter(e => e.id !== selected)
    			}
    		},
    		{
    			icon: "folder",
    			label: "Open in explorer",
    			onClick: async () => ElectronResources.shell.showItemInFolder(localStorage.getItem(StorageKeys.ROOT_PATH) + FileSystemUtil.sep + selected)
    		},
    	],
    	internalID
    	)
    	ToastNotificationSystem.get()

    	if (!localStorage.getItem(StorageKeys.ROOT_PATH))
    		localStorage.setItem(StorageKeys.ROOT_PATH, FileSystemUtil.rootDir)
    	basePath = localStorage.getItem(StorageKeys.ROOT_PATH)

    })
    $: {
    	if (basePath)
    		refreshProjects(basePath).then(r => projectsToShow = r).catch(console.error)
    }
    onDestroy(() => ContextMenuService.getInstance().destroy(internalID))

    async function onRename(newName, item) {
    	const pathName = ElectronResources.path.resolve(localStorage.getItem(StorageKeys.ROOT_PATH) + FileSystemUtil.sep + item.id + FileSystemUtil.sep + FileTypes.PROJECT)
    	const res = await FileSystemUtil.read(pathName)
    	if (!res)
    		return
    	await FileSystemUtil.write(
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