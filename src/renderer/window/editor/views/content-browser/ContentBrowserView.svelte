<script lang="ts">
    import {onDestroy, onMount} from "svelte"
    import NavigationHistory from "./libs/NavigationHistory"
    import SideBar from "./components/SideBar.svelte"
    import Browser from "./components/Browser.svelte"
    import Header from "./components/Header.svelte"
    import GlobalContentBrowserController from "./libs/GlobalContentBrowserController"
    import ITEM_TYPES from "./static/ITEM_TYPES"
    import ResizableBar from "../../../shared/components/resizable/ResizableBar.svelte"
    import {SORTS, SORTS_KEYS} from "./static/SORT_INFO"
    import FileSystemUtil from "../../../shared/FileSystemUtil"
    import ContentBrowserItem from "./components/info-editor/ContentBrowserItem.svelte";
    import SerializedState from "../../components/view/SerializedState.svelte";

    const COMPONENT_ID = crypto.randomUUID()

    let sortKey = SORTS_KEYS[0]
    let sortDirection = SORTS[0]
    let currentDirectory = {id: FileSystemUtil.sep}
    let fileType = undefined
    let inputValue = ""
    let navigationHistory = new NavigationHistory(v => currentDirectory = v)
    let viewType = ITEM_TYPES.ROW

    onMount(() => GlobalContentBrowserController.subscribe(COMPONENT_ID, newDir => {
        navigationHistory.updateCurrentDirectory({id: newDir}, currentDirectory)
    }))

    onDestroy(() => GlobalContentBrowserController.unsubscribe(COMPONENT_ID))
</script>

<SerializedState
        state={{sortKey,sortDirection,currentDirectory,fileType ,inputValue ,navigationHistory,viewType       }}
        onStateInitialize={state => {
            sortKey = state.sortKey
            sortDirection = state.sortDirection
            currentDirectory = state.currentDirectory
            fileType = state.fileType
            inputValue  = state.inputValue
            navigationHistory = state.navigationHistory
            viewType = state.viewType
        }}
/>
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
                fileType={fileType}
                setFileType={v => fileType = v}
                onChange={v => inputValue = v}
                inputValue={inputValue}

        />
    </div>
    <ResizableBar type={"width"}/>
    <ContentBrowserItem/>
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

