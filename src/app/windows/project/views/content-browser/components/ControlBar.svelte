<script>

    import NodeFS from "../../../../../libs/NodeFS"
    import FilesAPI from "../../../../../libs/files/FilesAPI"
    import importFile from "../../../libs/import-file"
    import EngineStore from "../../../stores/EngineStore";
    import {onDestroy} from "svelte";
    import ToolTip from "../../../../../components/tooltip/ToolTip.svelte";
    import Icon from "../../../../../components/icon/Icon.svelte";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";
    import Input from "../../../../../components/input/Input.svelte";
    import FILE_TYPES from "../../../../../../assets/FILE_TYPES"
    import SELECTION_TYPES from "../templates/SELECTION_TYPES";
    import selection from "../utils/selection";
    import FilesStore from "../../../stores/FilesStore";

    export let translate

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
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    onDestroy(() => unsubscribeEngine())

</script>
<div data-vertdivider="-"></div>
{#if view.navigation}
    <div class="button-group" style="width: 100%">
        <div class="button-group">
            <button class="settings-button" on:click={() => navigationHistory.returnDir()}>
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
                            if(currentDirectory.id === FilesAPI.sep)
                                return
                            navigationHistory.goToParent(currentDirectory)
                        }}
            >
                <Icon styles="transform: rotate(180deg)">subdirectory_arrow_right
                </Icon>
                <ToolTip content={translate("PARENT_DIR")}/>
            </button>
            <div data-vertdivider="-"></div>
            <button
                    disabled="{loading}"
                    class="settings-button"
                    on:click={() => {
                        alert.pushAlert(translate("REFRESHING"), "info")
                        FilesStore.refreshFiles().then(() => loading = false).catch()
                    }}
            >
                <Icon>sync</Icon>
                <ToolTip content={translate("REFRESH")}/>
            </button>
            <button class="settings-button" on:click={() => FilesStore.createFolder(currentDirectory).catch()}>
                <Icon styles="transform: rotate(180deg)">create_new_folder</Icon>
                <ToolTip content={translate("CREATE_FOLDER")}/>
            </button>
            <button
                    class="settings-button"
                    data-highlight={starred ? "-" : undefined}
                    on:click={() => {
                        if (starred)
                            FilesStore.removeBookmark(currentDirectory.id)
                        else
                            FilesStore.addBookmark(currentDirectory.id)
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
                    <button on:click={() => fileType = (fileType === FILE_TYPES[k] ? undefined : FILE_TYPES[k])}
                            style="text-transform: capitalize">
                        {#if fileType === FILE_TYPES[k]}
                            <Icon>check</Icon>
                        {/if}
                        {k.toLowerCase().replace("_", " ")}
                    </button>
                {/each}

            </Dropdown>
        </div>
        <div data-vertdivider="-"></div>
        <Input
                minWidth="250px"
                height="23px"
                width={"100%"}
                searchString={currentDirectory.id}
                noIcon={true}
                noPlaceHolder={true}
                noAutoSubmit={true}
                setSearchString={async (path) => {
                        if (await NodeFS.exists(FilesStore.ASSETS_PATH + path))
                        setCurrentDirectory({
                            id: path
                        })
                    }}
        />
        <Input
                minWidth="250px"
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

<div class="button-group" style="justify-content: flex-end">
    <Dropdown>
        <button slot="button" style="padding-left: 8px; border: none">
            {translate("VIEW")}
        </button>
        <button on:click={() => setView({...view, navigation: !view.navigation})}>
            {#if view.navigation}
                <Icon>check</Icon>
            {/if}
            {translate("OPTIONS")}

        </button>
        <button on:click={() => setView({...view, sideBar: !view.sideBar})}>
            {#if view.sideBar}
                <Icon>check</Icon>
            {/if}
            {translate("SIDE_BAR")}

        </button>

    </Dropdown>
    <Dropdown>
        <button slot="button" style="padding-left: 8px; border: none">
            {translate("SELECT")}
        </button>
        <button on:click={() => selection(SELECTION_TYPES.ALL, currentDirectory)}>
            {translate("SELECT_ALL")}
        </button>

        <button on:click={() => selection(SELECTION_TYPES.NONE, currentDirectory)}>
            {translate("SELECT_NONE")}
        </button>
        <button on:click={() => selection(SELECTION_TYPES.INVERT, currentDirectory)}>
            {translate("SELECT_INVERT")}
        </button>
    </Dropdown>
    <div data-vertdivider="-"></div>
    <button
            style="width: 75px; gap: 4px; padding: 0 16px"
            class="settings-button"
            on:click={() => importFile(currentDirectory)}
    >
        <Icon>open_in_new</Icon>
        {translate("IMPORT")}
    </button>
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

    .button-group {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 2px;

    }

</style>