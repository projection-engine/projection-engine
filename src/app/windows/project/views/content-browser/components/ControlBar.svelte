<script>

    import AsyncFS from "../../../libs/AsyncFS"
    import FileSystem from "../../../libs/FileSystem"
    import importFile from "../utils/import-file"
    import DataStoreController from "../../../stores/DataStoreController";
    import {onDestroy} from "svelte";
    import ToolTip from "../../../../../components/tooltip/ToolTip.svelte";
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";
    import Input from "../../../../../components/input/Input.svelte";
    import FILE_TYPES from "../../../../../../static/FILE_TYPES"
    import SELECTION_TYPES from "../templates/SELECTION_TYPES";
    import selection from "../utils/selection";
    import FileStoreController from "../../../stores/FileStoreController";

    export let translate
    export let setSelected
    export let selected
    export let view
    export let fileType
    export let searchString
    export let setSearchString
    export let path
    export let hidden
    export let bookmarks
    export let currentDirectory
    export let setCurrentDirectory
    export let setView
    export let navigationHistory

    let loading = false
    $: starred = bookmarks.find(b => b.path === currentDirectory.id) !== undefined

    let engine = {}
    const unsubscribeEngine = DataStoreController.getEngine(v => engine = v)
    onDestroy(() => unsubscribeEngine())

</script>
<div class="wrapper" style={hidden ? "border: none" : undefined}>
    {#if view.navigation}
        <div class="buttonGroup" style="width: 100%">
            <div class="buttonGroup">
                <button
                        class="settings-button"
                        on:click={() => navigationHistory.returnDir()}
                >
                    <Icon>arrow_back</Icon>
                    <ToolTip content={translate("BACK_DIR")}/>
                </button>
                <button
                        class="settings-button"
                        on:click={() => navigationHistory.forwardDir()}
                >
                    <Icon styles="transform: rotate(180deg)">arrow_back</Icon>
                    <ToolTip content={translate("FORWARD_DIR")}/>
                </button>
                <button
                        class="settings-button"

                        on:click={() => {
                            if(currentDirectory.id === FileSystem.sep)
                                return
                            navigationHistory.goToParent(currentDirectory)
                        }}
                >
                    <Icon styles="transform: rotate(180deg)">subdirectory_arrow_right
                    </Icon>
                    <ToolTip content={translate("PARENT_DIR")}/>
                </button>
                <div class="divider"></div>
                <button
                        disabled="{loading}"
                        class="settings-button"
                        on:click={() => {
                        alert.pushAlert(translate("REFRESHING"), "info")
                        FileStoreController.refreshFiles().then(() => loading = false).catch()
                    }}
                >
                    <Icon>sync</Icon>
                    <ToolTip content={translate("REFRESH")}/>
                </button>
                <button
                        class="settings-button"
                        on:click={async () => {
                        let path = currentDirectory.id + FileSystem.sep + translate("NEW_FOLDER")

                        const existing = window.fileSystem.foldersFromDirectory(FileStoreController.ASSETS_PATH + currentDirectory.id)
                        if (existing.length > 0)
                            path += " - " + existing.length
                        await AsyncFS.mkdir(FileStoreController.ASSETS_PATH + path, {})
                        FileStoreController.refreshFiles().then(() => loading = false).catch()
                    }}

                >
                    <Icon styles="transform: rotate(180deg)">create_new_folder</Icon>
                    <ToolTip content={translate("CREATE_FOLDER")}/>
                </button>
                <button
                        class="settings-button"
                        data-highlight={starred ? "-" : undefined}
                        on:click={() => {
                        if (starred)
                            FileStoreController.removeBookmark(currentDirectory.id)
                        else
                            FileStoreController.addBookmark(currentDirectory.id)
                    }}
                >
                    <Icon>star</Icon>
                    <ToolTip content={translate("ADD_BOOKMARK")}/>
                </button>
                <Dropdown disabled={loading} hideArrow={true}>
                    <button class="settings-button" slot="button"
                            data-highlight={fileType !== undefined ? "-" : undefined}>
                        <ToolTip content={translate("FILTER_TYPE")}/>
                        <Icon>filter_alt</Icon>
                    </button>

                    {#each Object.keys(FILE_TYPES) as k, i}
                        <button on:click={() => fileType = (fileType === FILE_TYPES[k] ? undefined : FILE_TYPES[k])} style="text-transform: capitalize">
                            {#if fileType === FILE_TYPES[k]}
                                <Icon>check</Icon>
                            {/if}
                            {k.toLowerCase().replace("_", " ")}
                        </button>
                    {/each}

                </Dropdown>
            </div>
            <Input
                    height="23px"
                    width={"100%"}
                    searchString={currentDirectory.id}
                    noIcon={true}
                    noPlaceHolder={true}
                    noAutoSubmit={true}
                    setSearchString={async (path) => {
                        if (await AsyncFS.exists(FileStoreController.ASSETS_PATH + path))
                        setCurrentDirectory({
                            id: path
                        })
                    }}
            />
            <Input
                    height="23px"
                    searchString={searchString}
                    setSearchString={setSearchString}
                    width={"25%"}
                    placeholder={translate("SEARCH")}
            >
                <Icon slot="icon">search</Icon>
            </Input>
        </div>
    {/if}

    <div class="buttonGroup" style="justify-content: flex-end">
        <Dropdown>
            <button slot="button" style="padding-left: 8px; border: none">
                {translate("VIEW")}
            </button>
            <button on:click={() => setView({...view, navigation: !view.navigation})}>
                {translate("OPTIONS")}
                {#if view.navigation}
                    <Icon>check</Icon>
                {/if}
            </button>
            <button on:click={() => setView({...view, sideBar: !view.sideBar})}>
                {translate("SIDE_BAR")}
                {#if view.sideBar}
                    <Icon>check</Icon>
                {/if}
            </button>

        </Dropdown>
        <Dropdown>
            <button slot="button" style="padding-left: 8px; border: none">
                {translate("SELECT")}
            </button>
            <button on:click={() => selection(SELECTION_TYPES.ALL, currentDirectory, setSelected, selected)}>
                {translate("SELECT_ALL")}
            </button>

            <button on:click={() => selection(SELECTION_TYPES.NONE, currentDirectory, setSelected, selected)}>
                {translate("SELECT_NONE")}
            </button>
            <button on:click={() => selection(SELECTION_TYPES.INVERT, currentDirectory, setSelected, selected)}>
                {translate("SELECT_INVERT")}
            </button>
        </Dropdown>
        <div class="divider"></div>
        <button
                style="width: 75px; gap: 4px; padding: 0 16px"
                class="settings-button"
                on:click={() => importFile(currentDirectory)}
        >
            <Icon>open_in_new</Icon>
            {translate("IMPORT")}
        </button>
    </div>
</div>
<style>
    .settings-button {
        height: 23px;
        min-width: 23px;
        padding: 0 2px;
        display: flex;
        border-radius: 3px;
        align-items: center;
        justify-content: center;
        font-size: 0.7rem;
        background: var(--pj-border-primary);
        border: none !important;
    }

    .settings-button:disabled {
        color: #999;
    }

    .divider {
        width: 2px;
        height: 20px;
        min-width: 2px;
        margin: 0 4px;
        background: var(--pj-background-tertiary);
    }

    .wrapper {
        height: 100%;
        padding-left: 4px;
        width: 100%;
        display: flex;
        align-items: center;
        gap: 4px;
        max-height: 35px;
        border-left: var(--pj-background-tertiary) 2px solid;
    }

    .buttonGroup {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 2px;
    }

</style>