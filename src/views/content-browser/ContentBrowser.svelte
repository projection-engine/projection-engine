<script>
    import {onDestroy, onMount} from "svelte";
    import FilesStore from "../../stores/FilesStore";
    import NavigationHistory from "./libs/NavigationHistory";
    import SideBar from "./components/SideBar.svelte";
    import ResizableBar from "shared-resources/frontend/components/resizable/ResizableBar.svelte";
    import Browser from "./components/Browser.svelte";
    import Header from "./components/Header.svelte";
    import {v4} from "uuid";
    import GlobalContentBrowserController from "./libs/GlobalContentBrowserController";
    import ViewStateController from "../../components/view/libs/ViewStateController";
    import ITEM_TYPES from "./templates/ITEM_TYPES";
    import NodeFS from "shared-resources/frontend/libs/NodeFS";
    import SettingsStore from "../../stores/SettingsStore";


    export let viewID
    export let viewIndex
    export let groupIndex

    const internalID = v4()
    let store = {}
    let viewType = ITEM_TYPES.ROW
    const unsubscribeStore = FilesStore.getStore(v => store = v)

    let currentDirectory = {id: NodeFS.sep}
    let wasInitialized = false

    $: viewTypeCache = viewID + "-" + viewIndex + "-" + groupIndex + "-" + SettingsStore.data.currentView
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

    let fileType = undefined
    let searchString = ""
    let navigationHistory = new NavigationHistory(v => currentDirectory = v)

    onMount(() => {
        GlobalContentBrowserController.subscribe(internalID, newDir => {
            navigationHistory.updateCurrentDirectory({id: newDir}, currentDirectory)
        })
    })
    onDestroy(() => {
        GlobalContentBrowserController.unsubscribe(internalID)
        unsubscribeStore()
    })

</script>


<Header
        fileType={fileType}
        setFileType={v => fileType = v}
        setViewType={v => viewType = v}
        viewType={viewType}
        bookmarks={store.bookmarks}

        searchString={searchString}
        setSearchString={v => searchString = v}
        currentDirectory={currentDirectory}
        setCurrentDirectory={v => navigationHistory.updateCurrentDirectory(v, currentDirectory)}
        navigationHistory={navigationHistory}
/>


<div class="wrapper">
    <SideBar
            items={store.items}
            bookmarks={store.bookmarks}

            currentDirectory={currentDirectory}
            setCurrentDirectory={v => navigationHistory.updateCurrentDirectory(v, currentDirectory)}

    />
    <ResizableBar type={"width"}/>
    <div class="browser">
        <Browser
                viewType={viewType}
                internalID={internalID}
                store={store}
                currentDirectory={currentDirectory}
                setCurrentDirectory={v => navigationHistory.updateCurrentDirectory(v, currentDirectory)}
                navigationHistory={navigationHistory}
                setSearchString={v => searchString = v}
                fileType={fileType}

                setFileType={v => fileType = v}
                searchString={searchString}

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

