<script>

    import importFile from "../../../libs/import-file"
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import Dropdown from "../../../../shared/components/dropdown/Dropdown.svelte";
    import Input from "../../../../shared/components/input/Input.svelte";

    import SELECTION_TYPES from "../templates/SELECTION_TYPES";
    import selection from "../utils/selection";
    import FILE_TYPES from "../../../../static/FILE_TYPES"

    export let translate
    export let view
    export let currentDirectory
    export let setView
    export let fileType
    export let setFileType
    export let setSearchString
    export let searchString

</script>

<div data-vertdivider="-"></div>
<Dropdown>
    <button slot="button" data-viewbutton="-">
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
    <button slot="button" data-viewbutton="-">
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
<Dropdown asButton={true}>
    <button slot="button" data-viewbutton="-">
        <ToolTip content={translate("FILTER_TYPE")}/>
        <Icon styles="font-size: .9rem">filter_alt</Icon>
        {#if fileType}
            {fileType.toLowerCase().replace("_", " ")}
        {:else}
            {translate("FILE_TYPE")}
        {/if}
    </button>

    {#each Object.keys(FILE_TYPES) as k, i}
        <button on:click={() => setFileType(fileType === FILE_TYPES[k] ? undefined : FILE_TYPES[k])}
                style="text-transform: capitalize">
            {#if fileType === FILE_TYPES[k]}
                <Icon>check</Icon>
            {/if}
            {k.toLowerCase().replace("_", " ")}
        </button>
    {/each}
</Dropdown>
<Input
        hasBorder={true}
        width={"250px"}
        height="22px"
        placeholder={translate("SEARCH")}
        searchString={searchString}
        setSearchString={setSearchString}
/>

<button
        class="settings-button"
        on:click={() => importFile(currentDirectory)}
>
    <Icon styles="font-size: .9rem">open_in_new</Icon>
    {translate("IMPORT")}
</button>

<style>
    .settings-button {
        min-height: 22px;
        max-height: 22px;
        display: flex;
        align-items: center;
        gap: 6px;

        padding: 0 6px;
        border-radius: 3px;

        font-size: 0.7rem;
        background: var(--pj-background-tertiary);
        margin-left: auto;
    }

    .settings-button:disabled {
        color: #999;
    }

</style>