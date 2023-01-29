<script>
    import FilesStore from "../../../stores/FilesStore";
    import EngineStore from "../../../stores/EngineStore";
    import {onDestroy} from "svelte";

    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import ITEM_TYPES from "../static/ITEM_TYPES";
    import getFileTypes from "../utils/get-file-types";
    import importFile from "../../../utils/import-file";
    import ViewHeader from "../../../components/view/components/ViewHeader.svelte";
    import getDropdownHeaderStyles from "../../../../../components/dropdown/utils/get-dropdown-header-styles";
    import Icon from "../../../../../components/icon/Icon.svelte";
    import ToolTip from "../../../../../components/tooltip/ToolTip.svelte";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";
    import Input from "../../../../../components/input/Input.svelte";
    import FILE_TYPES from "../../../../../../static/objects/FILE_TYPES";
    import AlertController from "../../../../../components/alert/AlertController";
    import FS from "../../../../../lib/FS/FS";
    import SortingOptions from "./SortingOptions.svelte";

    export let currentDirectory
    export let setCurrentDirectory
    export let fileType
    export let onChange
    export let inputValue
    export let navigationHistory
    export let viewType
    export let setViewType
    export let setFileType

    export let setSortKey
    export let setSortDirection
    export let sortDirection
    export let sortKey



    $: fileTypes = getFileTypes()

    let engine = {}
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    onDestroy(() => unsubscribeEngine())
</script>

<ViewHeader>
    <div data-svelteinline="-" style="width: 100%">
        <button data-sveltebuttondefault="-"
                data-svelteview-header-button="-"
                on:click={() => navigationHistory.undo()}
        >
            <Icon styles="font-size: .9rem">arrow_back</Icon>
            <ToolTip content={LOCALIZATION_EN.BACK_DIR}/>
        </button>
        <button data-sveltebuttondefault="-"
                data-svelteview-header-button="-"
                on:click={() => navigationHistory.redo()}
        >
            <Icon styles="transform: rotate(180deg)">arrow_back</Icon>
            <ToolTip content={LOCALIZATION_EN.FORWARD_DIR}/>
        </button>
        <button data-sveltebuttondefault="-"
                data-svelteview-header-button="-"
                on:click={() => {
                    if(currentDirectory.id === FS.sep)
                        return
                    navigationHistory.goToParent(currentDirectory)
                }}
        >
            <Icon styles="transform: rotate(180deg)">subdirectory_arrow_right</Icon>
            <ToolTip content={LOCALIZATION_EN.PARENT_DIR}/>
        </button>
        <button data-sveltebuttondefault="-"
                data-svelteview-header-button="-"
                on:click={() => {
                    AlertController.warn(LOCALIZATION_EN.REFRESHING)
                    FilesStore.refreshFiles().catch()
                }}
        >
            <Icon styles="font-size: .9rem">sync</Icon>
            <ToolTip content={LOCALIZATION_EN.REFRESH}/>
        </button>
        <button data-sveltebuttondefault="-"
                data-svelteview-header-button="-"
                on:click={() => FilesStore.createFolder(currentDirectory).catch()}
        >
            <Icon styles="transform: rotate(180deg)">create_new_folder</Icon>
            <ToolTip content={LOCALIZATION_EN.CREATE_FOLDER}/>
        </button>
        <div data-sveltevertdivider="-"></div>
        <Input
                width="50%"
                hasBorder={true}
                height="22px"
                placeholder={LOCALIZATION_EN.SEARCH}
                inputValue={inputValue}
                onChange={onChange}
        />
        <div data-sveltevertdivider="-"></div>
        <Dropdown buttonStyles={getDropdownHeaderStyles(fileType != null)}>
            <button data-sveltebuttondefault="-"  slot="button" data-svelteview-header-dropdown="-">
                <ToolTip content={LOCALIZATION_EN.FILTER_TYPE}/>
                <Icon styles="font-size: .9rem">filter_alt</Icon>
            </button>
            {#each fileTypes as k, i}
                <button data-sveltebuttondefault="-"
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
        <SortingOptions
                {setSortKey}
                {setSortDirection}
                {sortDirection}
                {sortKey}
        />
    </div>
    <div data-svelteinline="-" style="width: 100%; justify-content: flex-end">
        <button data-sveltebuttondefault="-"
                data-sveltehighlight={viewType === ITEM_TYPES.ROW ? "-" : ""}
                on:click={() => setViewType(ITEM_TYPES.ROW)}
                data-svelteview-header-button="-"
        >
            <Icon styles="font-size: .9rem">view_stream</Icon>
            <ToolTip content={LOCALIZATION_EN.ROW_VIEW}/>
        </button>
        <button data-sveltebuttondefault="-"
                data-sveltehighlight={viewType === ITEM_TYPES.CARD ? "-" : ""}
                on:click={() => setViewType(ITEM_TYPES.CARD)}
                data-svelteview-header-button="-"
        >
            <Icon styles="transform: rotate(180deg)">grid_view</Icon>
            <ToolTip content={LOCALIZATION_EN.CARD_VIEW}/>
        </button>
        <div data-sveltevertdivider="-"></div>
        <button data-sveltebuttondefault="-"
                on:click={() => importFile(currentDirectory)}
                data-sveltefocusbutton="-"
                style="max-height: 22px"
        >
            {LOCALIZATION_EN.IMPORT}
            <Icon styles="font-size: .9rem">open_in_new</Icon>
        </button>
    </div>
</ViewHeader>
