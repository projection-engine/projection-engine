<script>
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import FilesStore from "../../../stores/FilesStore";
    import EngineStore from "../../../stores/EngineStore";
    import {onDestroy} from "svelte";

    import Input from "shared-resources/frontend/components/input/Input.svelte";
    import NodeFS from "shared-resources/frontend/libs/NodeFS"
    import Localization from "../../../templates/LOCALIZATION_EN";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import ITEM_TYPES from "../templates/ITEM_TYPES";
    import getFileTypes from "../utils/get-file-types";
    import FILE_TYPES from "shared-resources/FILE_TYPES";
    import importFile from "../../../utils/import-file";
    import ViewHeader from "../../../components/view/components/ViewHeader.svelte";
    import getDropdownHeaderStyles from "../../../utils/get-dropdown-header-styles";

    export let currentDirectory
    export let setCurrentDirectory
    export let fileType
    export let setSearchString
    export let searchString
    export let navigationHistory
    export let viewType
    export let setViewType
    export let setFileType


    $: fileTypes = getFileTypes()
    let loading = false

    let engine = {}
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    onDestroy(() => unsubscribeEngine())
</script>

<ViewHeader>
    <div data-inline="-" style="width: 100%">
        <button
                data-view-header-button="-"
                on:click={() => navigationHistory.undo()}
        >
            <Icon styles="font-size: .9rem">arrow_back</Icon>
            <ToolTip content={Localization.BACK_DIR}/>
        </button>
        <button
                data-view-header-button="-"
                on:click={() => navigationHistory.redo()}
        >
            <Icon styles="transform: rotate(180deg)">arrow_back</Icon>
            <ToolTip content={Localization.FORWARD_DIR}/>
        </button>
        <button
                data-view-header-button="-"
                on:click={() => {
                    if(currentDirectory.id === NodeFS.sep)
                        return
                    navigationHistory.goToParent(currentDirectory)
                }}
        >
            <Icon styles="transform: rotate(180deg)">subdirectory_arrow_right</Icon>
            <ToolTip content={Localization.PARENT_DIR}/>
        </button>
        <button
                disabled="{loading}"
                data-view-header-button="-"
                on:click={() => {
                    alert.pushAlert(Localization.REFRESHING, "info")
                    FilesStore.refreshFiles().then(() => loading = false).catch()
                }}
        >
            <Icon styles="font-size: .9rem">sync</Icon>
            <ToolTip content={Localization.REFRESH}/>
        </button>
        <button
                data-view-header-button="-"
                on:click={() => FilesStore.createFolder(currentDirectory).catch()}
        >
            <Icon styles="transform: rotate(180deg)">create_new_folder</Icon>
            <ToolTip content={Localization.CREATE_FOLDER}/>
        </button>
        <div data-vertdivider="-"></div>

        <Input
                width="50%"
                hasBorder={true}
                height="22px"
                placeholder={Localization.SEARCH}
                searchString={searchString}
                setSearchString={setSearchString}
        />
        <Dropdown buttonStyles={getDropdownHeaderStyles(fileType != null)}>
            <button slot="button" data-view-header-dropdown="-">
                <ToolTip content={Localization.FILTER_TYPE}/>
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
    <div data-inline="-" style="width: 100%; justify-content: flex-end">
        <button
                data-highlight={viewType === ITEM_TYPES.ROW ? "-" : ""}
                on:click={() => setViewType(ITEM_TYPES.ROW)}
                data-view-header-button="-"
        >
            <Icon styles="font-size: .9rem">view_stream</Icon>
            <ToolTip content={Localization.ROW_VIEW}/>
        </button>
        <button
                data-highlight={viewType === ITEM_TYPES.CARD ? "-" : ""}
                on:click={() => setViewType(ITEM_TYPES.CARD)}
                data-view-header-button="-"
        >
            <Icon styles="transform: rotate(180deg)">grid_view</Icon>
            <ToolTip content={Localization.CARD_VIEW}/>
        </button>
        <div data-vertdivider="-"></div>
        <button
                on:click={() => importFile(currentDirectory)}
                data-focusbutton="-"
                style="max-height: 22px"
        >
            {Localization.IMPORT}
            <Icon styles="font-size: .9rem">open_in_new</Icon>
        </button>
    </div>
</ViewHeader>
