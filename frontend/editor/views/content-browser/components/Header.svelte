<script>
    import FilesStore from "../../../stores/FilesStore";
    import EngineStore from "../../../stores/EngineStore";
    import {onDestroy} from "svelte";

    import LOCALIZATION_EN from "../../../../static/LOCALIZATION_EN";
    import ITEM_TYPES from "../templates/ITEM_TYPES";
    import getFileTypes from "../utils/get-file-types";
    import importFile from "../../../utils/import-file";
    import ViewHeader from "../../../../components/view/components/ViewHeader.svelte";
    import getDropdownHeaderStyles from "../../../../components/dropdown/utils/get-dropdown-header-styles";
    import Icon from "../../../../components/icon/Icon.svelte";
    import ToolTip from "../../../../components/tooltip/ToolTip.svelte";
    import Dropdown from "../../../../components/dropdown/Dropdown.svelte";
    import Input from "../../../../components/input/Input.svelte";
    import FILE_TYPES from "../../../../../static/objects/FILE_TYPES";
    import AlertController from "../../../../components/alert/AlertController";
    import NodeFS from "../../../../lib/FS/NodeFS";

    export let currentDirectory
    export let setCurrentDirectory
    export let fileType
    export let onChange
    export let inputValue
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
            <ToolTip content={LOCALIZATION_EN.BACK_DIR}/>
        </button>
        <button
                data-view-header-button="-"
                on:click={() => navigationHistory.redo()}
        >
            <Icon styles="transform: rotate(180deg)">arrow_back</Icon>
            <ToolTip content={LOCALIZATION_EN.FORWARD_DIR}/>
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
            <ToolTip content={LOCALIZATION_EN.PARENT_DIR}/>
        </button>
        <button

                disabled={loading}
                data-view-header-button="-"
                on:click={() => {
                    AlertController.warn(LOCALIZATION_EN.REFRESHING)
                    FilesStore.refreshFiles().then(() => loading = false).catch()
                }}
        >
            <Icon styles="font-size: .9rem">sync</Icon>
            <ToolTip content={LOCALIZATION_EN.REFRESH}/>
        </button>
        <button
                data-view-header-button="-"
                on:click={() => FilesStore.createFolder(currentDirectory).catch()}
        >
            <Icon styles="transform: rotate(180deg)">create_new_folder</Icon>
            <ToolTip content={LOCALIZATION_EN.CREATE_FOLDER}/>
        </button>
        <div data-vertdivider="-"></div>

        <Input
                width="50%"
                hasBorder={true}
                height="22px"
                placeholder={LOCALIZATION_EN.SEARCH}
                inputValue={inputValue}
                onChange={onChange}
        />
        <Dropdown buttonStyles={getDropdownHeaderStyles(fileType != null)}>
            <button slot="button" data-view-header-dropdown="-">
                <ToolTip content={LOCALIZATION_EN.FILTER_TYPE}/>
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
            <ToolTip content={LOCALIZATION_EN.ROW_VIEW}/>
        </button>
        <button
                data-highlight={viewType === ITEM_TYPES.CARD ? "-" : ""}
                on:click={() => setViewType(ITEM_TYPES.CARD)}
                data-view-header-button="-"
        >
            <Icon styles="transform: rotate(180deg)">grid_view</Icon>
            <ToolTip content={LOCALIZATION_EN.CARD_VIEW}/>
        </button>
        <div data-vertdivider="-"></div>
        <button
                on:click={() => importFile(currentDirectory)}
                data-focusbutton="-"
                style="max-height: 22px"
        >
            {LOCALIZATION_EN.IMPORT}
            <Icon styles="font-size: .9rem">open_in_new</Icon>
        </button>
    </div>
</ViewHeader>
