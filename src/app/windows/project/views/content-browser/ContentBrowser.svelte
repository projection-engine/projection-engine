<script>
    import FileSystem from "../../../../libs/FileSystem"
    import {onDestroy} from "svelte";
    import FileStoreController from "../../stores/FileStoreController";
    import Localization from "../../../../libs/Localization";
    import Header from "../../../../components/view/components/Header.svelte";
    import ControlBar from "./components/ControlBar.svelte";
    import NavigationHistory from "./libs/NavigationHistory";
    import SideBar from "./components/SideBar.svelte";
    import ResizableBar from "../../../../components/resizable/ResizableBar.svelte";
    import Files from "./components/Browser.svelte";

    export let hidden = undefined
    export let switchView = undefined
    export let orientation = undefined



    let store = {}
    const unsubscribeStore = FileStoreController.getStore(v => store = v)
    onDestroy(() => unsubscribeStore())

    let currentDirectory = {id: FileSystem.sep}
    let selected = []
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
            path: FileSystem.sep
        }, findParent(currentDirectory)].flat(Number.POSITIVE_INFINITY)
        if (currentDirectory.name)
            response.push({
                name: currentDirectory.name,
                path: currentDirectory.id
            })
        return response
    })();
    const translate = key => Localization.PROJECT.FILES[key]


</script>

<Header
        orientation={orientation}
        hidden={hidden}
        switchView={switchView}
        title={translate("TITLE")}
        icon={"folder"}
>
    <ControlBar
            currentDirectory={currentDirectory}
            setCurrentDirectory={v => navigationHistory.updateCurrentDirectory(v, currentDirectory)}
            bookmarks={store.bookmarks}
            translate={translate}
            setSelected={v => selected = v}
            selected={selected}
            fileType={fileType}
            setFileType={v => fileType = v}
            searchString={searchString}
            setSearchString={v => searchString = v}
            path={path}
            view={view}

            setView={v => view = v}
            navigationHistory={navigationHistory}
    />
</Header>
{#if !hidden}
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

        <Files
                items={store.items}
                currentDirectory={currentDirectory}
                setCurrentDirectory={v => navigationHistory.updateCurrentDirectory(v, currentDirectory)}
                navigationHistory={navigationHistory}
                translate={translate}
                setSearchString={v => searchString = v}
                fileType={fileType}

                setFileType={v => fileType = v}
                searchString={searchString}
                setSelected={v => selected = v}
                selected={selected}
        />
    </div>
{/if}

<style>
    .wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        overflow: hidden;
    }
</style>

