<script>

    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";

    import SELECTION_TYPES from "../templates/SELECTION_TYPES";
    import selection from "../utils/selection";
    import getFileTypes from "../utils/get-file-types";

    export let translate
    export let view
    export let currentDirectory
    export let setView
    export let fileType
    export let setFileType

    const STYLES = `
                  border-radius: 3px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  max-height: 22px;
                  min-height: 22px;
                `
    $: fileTypes = getFileTypes()
</script>

<Dropdown buttonStyles={STYLES}>
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
<Dropdown buttonStyles={STYLES}>
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

