<script lang="ts">
    import ITEM_TYPES from "../static/ITEM_TYPES"
    import ViewHeader from "../../../components/view/components/ViewHeader.svelte"
    import getDropdownHeaderStyles from "../../../../shared/components/dropdown/utils/get-dropdown-header-styles"
    import Icon from "../../../../shared/components/icon/Icon.svelte"
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte"
    import Dropdown from "../../../../shared/components/dropdown/Dropdown.svelte"
    import Input from "../../../../shared/components/input/Input.svelte"
    import ToastNotificationSystem from "../../../../shared/components/alert/ToastNotificationSystem"
    import SortingOptions from "./SortingOptions.svelte"
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"
    import FileTypes from "../../../../../../shared/enums/FileTypes"
    import EmptyIcon from "../../../../shared/components/icon/EmptyIcon.svelte"
    import ContentBrowserUtil from "../../../util/ContentBrowserUtil"
    import EditorUtil from "../../../util/EditorUtil"
    import FileSystemUtil from "../../../../shared/FileSystemUtil"
    import NavigationHistory from "../libs/NavigationHistory";

    export let currentDirectory: { id: string }
    export let fileType: string
    export let onChange: GenericVoidFunctionWithP<string>
    export let inputValue: string
    export let navigationHistory: typeof NavigationHistory
    export let viewType: string
    export let showDetails: boolean
    export let setViewType: GenericVoidFunctionWithP<string>
    export let setFileType: GenericVoidFunctionWithP<string>
    export let setSortKey: GenericVoidFunctionWithP<string>
    export let setShowDetails: GenericVoidFunctionWithP<boolean>
    export let setSortDirection: GenericVoidFunctionWithP<string>
    export let sortDirection: string
    export let sortKey: string

</script>

<ViewHeader>
    <div data-svelteinline="-" style="width: 100%">
        <button data-sveltebuttondefault="-"
                data-svelteview-header-button="-"
                on:click={() => navigationHistory.undo()}
        >
            <Icon>arrow_back</Icon>
            <ToolTip content={LocalizationEN.BACK_DIR}/>
        </button>
        <button data-sveltebuttondefault="-"
                data-svelteview-header-button="-"
                on:click={() => navigationHistory.redo()}
        >
            <Icon styles="transform: rotate(180deg)">arrow_back</Icon>
            <ToolTip content={LocalizationEN.FORWARD_DIR}/>
        </button>
        <button data-sveltebuttondefault="-"
                data-svelteview-header-button="-"
                on:click={() => {
                    if(currentDirectory.id === FileSystemUtil.sep)
                        return
                    navigationHistory.goToParent(currentDirectory)
                }}
        >
            <Icon styles="transform: rotate(180deg)">subdirectory_arrow_right</Icon>
            <ToolTip content={LocalizationEN.PARENT_DIR}/>
        </button>
        <button data-sveltebuttondefault="-"
                data-svelteview-header-button="-"
                on:click={() => {
                    ToastNotificationSystem.getInstance().warn(LocalizationEN.REFRESHING)
                    ContentBrowserUtil.refreshFiles().catch(console.error)
                }}
        >
            <Icon styles="font-size: .9rem">sync</Icon>
            <ToolTip content={LocalizationEN.REFRESH}/>
        </button>
        <button data-sveltebuttondefault="-"
                data-svelteview-header-button="-"
                on:click={() => ContentBrowserUtil.createFolder(currentDirectory).catch(console.error)}
        >
            <Icon styles="transform: rotate(180deg)">create_new_folder</Icon>
            <ToolTip content={LocalizationEN.CREATE_FOLDER}/>
        </button>
        <div data-sveltevertdivider="-"></div>
        <Input
                width="50%"
                hasBorder={true}
                height="22px"
                placeholder={LocalizationEN.SEARCH}
                inputValue={inputValue}
                onChange={onChange}
        />
        <div data-sveltevertdivider="-"></div>
        <Dropdown buttonStyles={getDropdownHeaderStyles(fileType != null)}>
            <button data-sveltebuttondefault="-" slot="button" data-svelteview-header-dropdown="-">
                <ToolTip content={LocalizationEN.FILTER_TYPE}/>
                <Icon styles="font-size: .9rem">filter_alt</Icon>
            </button>
            {#each ContentBrowserUtil.getFileTypes() as k, i}
                <button data-sveltebuttondefault="-"
                        on:click={() => setFileType(fileType === FileTypes[k[0]] ? undefined : FileTypes[k[0]])}
                        style="text-transform: capitalize"
                >
                    {#if fileType === FileTypes[k[0]]}
                        <Icon>check</Icon>
                    {:else}
                        <EmptyIcon/>
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
                data-sveltehighlight={showDetails ? "-" : ""}
                on:click={() => setShowDetails(!showDetails)}
                data-svelteview-header-button="-"
                style="max-width: unset"
        >
            <Icon>settings</Icon>
            {LocalizationEN.SHOW_DETAILS}
        </button>
        <div data-sveltevertdivider="-"></div>
        <button data-sveltebuttondefault="-"
                data-sveltehighlight={viewType === ITEM_TYPES.ROW ? "-" : ""}
                on:click={() => setViewType(ITEM_TYPES.ROW)}
                data-svelteview-header-button="-"
        >
            <Icon styles="font-size: .9rem">view_stream</Icon>
            <ToolTip content={LocalizationEN.ROW_VIEW}/>
        </button>
        <button data-sveltebuttondefault="-"
                data-sveltehighlight={viewType === ITEM_TYPES.CARD ? "-" : ""}
                on:click={() => setViewType(ITEM_TYPES.CARD)}
                data-svelteview-header-button="-"
        >
            <Icon styles="transform: rotate(180deg)">grid_view</Icon>
            <ToolTip content={LocalizationEN.CARD_VIEW}/>
        </button>
        <div data-sveltevertdivider="-"></div>
        <button data-sveltebuttondefault="-"
                on:click={() => EditorUtil.importFile(currentDirectory)}
                data-sveltefocusbutton="-"
                style="max-height: 22px"
        >
            {LocalizationEN.IMPORT}
            <Icon styles="font-size: .9rem">open_in_new</Icon>
        </button>
    </div>
</ViewHeader>
