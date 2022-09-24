<script>
    import FilesAPI from "../../../shared/libs/files/FilesAPI"
    import {onDestroy, onMount} from "svelte";
    import FilesStore from "../../stores/FilesStore";
    import Localization from "../../../shared/libs/Localization";
    import Header from "../../../shared/components/view/components/Header.svelte";
    import ControlBar from "./components/ControlBar.svelte";
    import NavigationHistory from "./libs/NavigationHistory";
    import SideBar from "./components/SideBar.svelte";
    import ResizableBar from "../../../shared/components/resizable/ResizableBar.svelte";
    import Browser from "./components/Browser.svelte";
    import BrowserNavigation from "./components/BrowserNavigation.svelte";
    import {v4} from "uuid";
    import GlobalContentBrowserController from "./libs/GlobalContentBrowserController";

    export let hidden = undefined
    export let switchView = undefined
    export let orientation = undefined

    const internalID = v4()
    let store = {}
    const unsubscribeStore = FilesStore.getStore(v => store = v)

    let currentDirectory = {id: FilesAPI.sep}

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
            path: FilesAPI.sep
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
        orientation={orientation}
        hidden={hidden}
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

<div class="wrapper" style={hidden ? "display: none" : undefined}>
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
                    bookmarks={store.bookmarks}
                    path={path}
                    currentDirectory={currentDirectory}
                    setCurrentDirectory={v => navigationHistory.updateCurrentDirectory(v, currentDirectory)}
                    navigationHistory={navigationHistory}
            />
        {/if}
        <Browser
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

