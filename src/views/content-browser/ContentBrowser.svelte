<script>
    import {onDestroy, onMount} from "svelte";
    import FilesStore from "../../stores/FilesStore";
    import Localization from "../../libs/libs/Localization";
    import Header from "../../components/view/components/ViewHeader.svelte";
    import ControlBar from "./components/ControlBar.svelte";
    import NavigationHistory from "./libs/NavigationHistory";
    import SideBar from "./components/SideBar.svelte";
    import ResizableBar from "shared-resources/frontend/components/resizable/ResizableBar.svelte";
    import Browser from "./components/Browser.svelte";
    import BrowserNavigation from "./components/BrowserNavigation.svelte";
    import {v4} from "uuid";
    import GlobalContentBrowserController from "./libs/GlobalContentBrowserController";
    import ViewStateController from "../../components/view/libs/ViewStateController";
    import VIEWS from "../../components/view/data/VIEWS";
    import ITEM_TYPES from "./templates/ITEM_TYPES";
    import NodeFS from "shared-resources/frontend/libs/NodeFS";
    import SettingsStore from "../../stores/SettingsStore";

    export let switchView = undefined
    export let orientation = undefined
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
    let view = {
        sideBar: true,
        navigation: true
    }
    let navigationHistory = new NavigationHistory(v => currentDirectory = v)

    $: path = (() => {
        const findParent = (node) => {
            const p = store.items.find(n => n.id === node.parent)
            return p ? [findParent(p), {name: p.name, path: p.id}] : []
        }
        const response = [{
            path: NodeFS.sep
        }, findParent(currentDirectory)].flat(Number.POSITIVE_INFINITY)
        if (currentDirectory.name)
            response.push({
                name: currentDirectory.name,
                path: currentDirectory.id
            })
        return response
    })();
    const translate = key => Localization.PROJECT.FILES[key]

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
        currentView={VIEWS.FILES}
        orientation={orientation}
        switchView={switchView}
        title={translate("TITLE")}
        icon={"folder"}
>
    <ControlBar
            setFileType={v => fileType = v}
            fileType={fileType}
            currentDirectory={currentDirectory}
            translate={translate}
            view={view}
            setView={v => view = v}


            searchString={searchString}
            setSearchString={v => searchString = v}
    />
</Header>

<div class="wrapper">
    {#if view.sideBar}
        <SideBar
                items={store.items}
                bookmarks={store.bookmarks}

                currentDirectory={currentDirectory}
                setCurrentDirectory={v => navigationHistory.updateCurrentDirectory(v, currentDirectory)}
                translate={translate}
        />
        <ResizableBar type={"width"}/>
    {/if}

    <div class="browser">
        {#if view.navigation}
            <BrowserNavigation
                    setViewType={v => viewType = v}
                    viewType={viewType}
                    bookmarks={store.bookmarks}
                    path={path}
                    currentDirectory={currentDirectory}
                    setCurrentDirectory={v => navigationHistory.updateCurrentDirectory(v, currentDirectory)}
                    navigationHistory={navigationHistory}
            />
        {/if}
        <Browser
                viewType={viewType}
                internalID={internalID}
                path={path}
                view={view}

                store={store}
                currentDirectory={currentDirectory}
                setCurrentDirectory={v => navigationHistory.updateCurrentDirectory(v, currentDirectory)}
                navigationHistory={navigationHistory}
                translate={translate}
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
        overflow: hidden;
    }

    .wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        overflow: hidden;
        background: var(--pj-background-secondary)
    }
</style>

