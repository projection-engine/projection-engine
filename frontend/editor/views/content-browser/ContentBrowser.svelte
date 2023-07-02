<script>
    import {onDestroy, onMount} from "svelte"
    import NavigationHistory from "./libs/NavigationHistory"
    import SideBar from "./components/SideBar.svelte"
    import Browser from "./components/Browser.svelte"
    import Header from "./components/Header.svelte"

    import GlobalContentBrowserController from "./libs/GlobalContentBrowserController"
    import ViewStateController from "../../components/view/libs/ViewStateController"
    import ITEM_TYPES from "./static/ITEM_TYPES"
    import SettingsStore from "../../../stores/SettingsStore"
    import ResizableBar from "../../../shared/components/resizable/ResizableBar.svelte"
    import {SORTS, SORTS_KEYS} from "./static/SORT_INFO"
    import FileSystemUtil from "../../../shared/FileSystemUtil"

    const COMPONENT_ID = crypto.randomUUID()
    export let viewID
    export let viewIndex
    export let groupIndex

    let sortKey = SORTS_KEYS[0]
    let sortDirection = SORTS[0]
    let currentDirectory = {id: FileSystemUtil.sep}
    let wasInitialized = false
    let fileType = undefined
    let inputValue = ""
    let navigationHistory = new NavigationHistory(v => currentDirectory = v)
    let viewType = ITEM_TYPES.ROW

    $: viewTypeCache = viewID + "-" + viewIndex + "-" + groupIndex + "-" + SettingsStore.getData().currentView
    $: {
    	if (wasInitialized) {
    		localStorage.setItem(viewTypeCache, viewType)
    		ViewStateController.updateState(viewID, viewIndex, groupIndex, currentDirectory)
    	} else {
    		const viewT = localStorage.getItem(viewTypeCache)
    		const state = ViewStateController.getState(viewID, viewIndex, groupIndex)
    		if (state != null)
    			currentDirectory = state
    		if (viewT)
    			viewType = parseInt(viewT)
    		wasInitialized = true
    	}
    }

    onMount(() => {
    	GlobalContentBrowserController.subscribe(COMPONENT_ID, newDir => {
    		navigationHistory.updateCurrentDirectory({id: newDir}, currentDirectory)
    	})
    })
    onDestroy(() => GlobalContentBrowserController.unsubscribe(COMPONENT_ID))

</script>


<Header
        setSortKey={v => sortKey = v}
        setSortDirection={v => sortDirection = v}
        sortDirection={sortDirection}
        sortKey={sortKey}
        fileType={fileType}
        setFileType={v => fileType = v}
        setViewType={v => viewType = v}
        viewType={viewType}

        inputValue={inputValue}
        onChange={v => inputValue = v}
        currentDirectory={currentDirectory}
        setCurrentDirectory={v => navigationHistory.updateCurrentDirectory(v, currentDirectory)}
        navigationHistory={navigationHistory}
/>

<div class="wrapper">
    <SideBar
            currentDirectory={currentDirectory}
            setCurrentDirectory={v => navigationHistory.updateCurrentDirectory(v, currentDirectory)}

    />
    <ResizableBar type={"width"}/>
    <div class="browser">
        <Browser
                sortDirection={sortDirection}
                sortKey={sortKey}
                viewType={viewType}
                currentDirectory={currentDirectory}
                setCurrentDirectory={v => navigationHistory.updateCurrentDirectory(v, currentDirectory)}
                navigationHistory={navigationHistory}
                onChange={v => inputValue = v}
                fileType={fileType}

                setFileType={v => fileType = v}
                inputValue={inputValue}

        />
    </div>
</div>

<style>
    .browser {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 0 3px 3px;
        overflow: hidden;
    }

    .wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        overflow: hidden;
    }
</style>

