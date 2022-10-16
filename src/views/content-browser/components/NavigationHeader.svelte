<script>
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import FilesStore from "../../../stores/FilesStore";
    import EngineStore from "../../../stores/EngineStore";
    import {onDestroy} from "svelte";

    import Input from "shared-resources/frontend/components/input/Input.svelte";
    import NodeFS from "shared-resources/frontend/libs/NodeFS"
    import Localization from "../../../libs/libs/Localization";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import ITEM_TYPES from "../templates/ITEM_TYPES";
    import getFileTypes from "../utils/get-file-types";
    import FILE_TYPES from "shared-resources/FILE_TYPES";

    export let bookmarks
    export let currentDirectory
    export let setCurrentDirectory
    export let fileType
    export let setSearchString
    export let searchString
    export let path
    export let navigationHistory
    export let viewType
    export let setViewType
    export let setFileType


    $: fileTypes = getFileTypes()
    let loading = false
    $: starred = bookmarks.find(b => b.path === currentDirectory.id) !== undefined


    let engine = {}
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    onDestroy(() => unsubscribeEngine())
    const translate = key => Localization.PROJECT.FILES[key]
</script>

<div class="wrapper">
    <div class="button-group">
        <button class="button button-on-group" on:click={() => navigationHistory.undo()}>
            <Icon styles="font-size: .9rem">arrow_back</Icon>
            <ToolTip content={translate("BACK_DIR")}/>
        </button>
        <button
                class="button button-on-group"
                on:click={() => navigationHistory.redo()}
        >
            <Icon styles="transform: rotate(180deg)">arrow_back</Icon>
            <ToolTip content={translate("FORWARD_DIR")}/>
        </button>
        <button
                class="button button-on-group"
                on:click={() => {
                            if(currentDirectory.id === NodeFS.sep)
                                return
                            navigationHistory.goToParent(currentDirectory)
                        }}
        >
            <Icon styles="transform: rotate(180deg)">subdirectory_arrow_right</Icon>
            <ToolTip content={translate("PARENT_DIR")}/>
        </button>
        <button
                disabled="{loading}"
                class="button button-on-group"
                on:click={() => {
                    alert.pushAlert(translate("REFRESHING"), "info")
                    FilesStore.refreshFiles().then(() => loading = false).catch()
                }}
        >
            <Icon styles="font-size: .9rem">sync</Icon>
            <ToolTip content={translate("REFRESH")}/>
        </button>
        <button class="button button-on-group" on:click={() => FilesStore.createFolder(currentDirectory).catch()}>
            <Icon styles="transform: rotate(180deg)">create_new_folder</Icon>
            <ToolTip content={translate("CREATE_FOLDER")}/>
        </button>
    </div>
    <button
            class="button"
            data-highlight={starred ? "-" : undefined}
            on:click={() => {
                        if (starred)
                            FilesStore.removeBookmark(currentDirectory.id)
                        else
                            FilesStore.addBookmark(currentDirectory.id)
                    }}
    >
        <Icon styles="font-size: .9rem">star</Icon>
        <ToolTip content={translate("ADD_BOOKMARK")}/>
    </button>
    <Input
            hasBorder={true}

            height="22px"
            placeholder={translate("SEARCH")}
            searchString={currentDirectory.id}
            noAutoSubmit={true}
            setSearchString={async (path) => {
                if (await NodeFS.exists(NodeFS.ASSETS_PATH  + path))
                setCurrentDirectory({id: path })
            }}
    />
    <Input
            hasBorder={true}
            height="22px"
            placeholder={translate("SEARCH")}
            searchString={searchString}
            setSearchString={setSearchString}
    />

    <div class="button-group">
        <button
                data-highlight={viewType === ITEM_TYPES.ROW ? "-" : ""}
                on:click={() => setViewType(ITEM_TYPES.ROW)}
                class="button button-on-group"
        >
            <Icon styles="font-size: .9rem">view_stream</Icon>
            <ToolTip content={translate("ROW_VIEW")}/>
        </button>
        <button
                data-highlight={viewType === ITEM_TYPES.CARD ? "-" : ""}
                on:click={() => setViewType(ITEM_TYPES.CARD)}
                class="button button-on-group"
        >
            <Icon styles="transform: rotate(180deg)">grid_view</Icon>
            <ToolTip content={translate("CARD_VIEW")}/>
        </button>
        <Dropdown
                buttonStyles={`
                  border-radius: 0 3px 3px 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  max-height: 22px;
                  max-width: 22px;
                  min-height: 22px;
                  min-width: 22px;
                  border: var(--pj-background-secondary) 1px solid;
                  background: var(--pj-background-primary);
                `}
        >
            <button
                    data-highlight={viewType === ITEM_TYPES.CARD ? "-" : ""}
                    on:click={() => setViewType(ITEM_TYPES.CARD)}
            >
                {translate("CARD_VIEW")}
            </button>
            <button data-highlight={viewType === ITEM_TYPES.ROW ? "-" : ""}
                    on:click={() => setViewType(ITEM_TYPES.ROW)}>
                {translate("ROW_VIEW")}
            </button>
        </Dropdown>
    </div>
    <Dropdown
            buttonStyles={`
                  max-height: 22px;
                  min-height: 22px;
                  border-radius: 3px;
                  border: var(--pj-background-secondary) 1px solid;
                  background: ${fileType != null ? "var(--pj-accent-color)" : "var(--pj-background-primary)"};
                    color: ${fileType != null ? "white" : "var(--pj-color-secondary)"};
            `}
    >
        <button slot="button" style="background: transparent; border: none">
            <ToolTip content={translate("FILTER_TYPE")}/>
            <Icon styles="font-size: .9rem">filter_alt</Icon>
        </button>
        {#each fileTypes as k, i}
            <button
                    on:click={() => setFileType(fileType === FILE_TYPES[k[0]] ? undefined : FILE_TYPES[k[0]])}
                    style="text-transform: capitalize"
            >
                {#if fileType === FILE_TYPES[k[0]]}
                    <Icon>check</Icon>
                {:else}
                    <div style="width: 1.1rem"></div>
                {/if}
                {k[1]}
            </button>
        {/each}
    </Dropdown>
</div>


<style>
    .button-group {
        display: flex;
        align-items: center;
        border-collapse: collapse;
    }

    .button-on-group {
        border-radius: 0 !important;
    }

    .button-on-group:first-child {
        border-radius: 3px 0 0 3px !important;
    }

    .button-on-group:last-child {
        border-radius: 0 3px 3px 0 !important;
    }

    .wrapper {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 8px;

    }

    .button {
        display: flex;
        justify-content: center;
        align-items: center;
        max-height: 22px;
        max-width: 22px;
        min-height: 22px;
        min-width: 22px;
        border-color: var(--pj-background-secondary);
        background: var(--pj-background-primary);
    }
</style>