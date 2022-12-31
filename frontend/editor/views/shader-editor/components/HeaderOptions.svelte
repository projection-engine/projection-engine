<script>
    import Nodes from "./Nodes.svelte"
    import selection from "../utils/selection"
    import SELECTION_TYPES from "../static/SELECT_ACTIONS"

    import LOCALIZATION_EN from "../../../../static/LOCALIZATION_EN";
    import ShaderEditorTools from "../libs/ShaderEditorTools";
    import Selector from "../../../../components/selector/Selector.svelte";
    import getDropdownHeaderStyles from "../../../../components/dropdown/utils/get-dropdown-header-styles";
    import ToolTip from "../../../../components/tooltip/ToolTip.svelte";
    import Icon from "../../../../components/icon/Icon.svelte";
    import Dropdown from "../../../../components/dropdown/Dropdown.svelte";
    import ViewHeader from "../../../../components/view/components/ViewHeader.svelte";

    export let save
    export let openFile
    export let compile
    export let initializeFromFile
    export let nodes
    export let openSourceCode
    $: activeGrid = ShaderEditorTools.grid = ShaderEditorTools.GRID_SIZE
</script>

<ViewHeader>
    <div data-inline="-" style="width: 100%">
        <button
                disabled={!openFile}
                data-view-header-button="-"
                style="max-width: unset"
                on:click={save}>
            <Icon styles="font-size: .9rem">save</Icon>
            {LOCALIZATION_EN.SAVE}
        </button>
        <div data-vertdivider="-"></div>
        <button
                disabled={!openFile}
                data-view-header-button="-"
                style="max-width: unset"
                on:click={compile}
        >
            <Icon styles="font-size: .9rem">code</Icon>
            {LOCALIZATION_EN.COMPILE}
        </button>
        <div data-vertdivider="-"></div>
        <Selector
                styles={`max-width: ${openFile ? "10vw" : "15vw"};`}
                mergeMaterials={false}
                size="small"
                type="material"
                noDefault="true"
                handleChange={initializeFromFile}
                selected={openFile}
        />

        {#if openFile}
            <div data-vertdivider="-"></div>
            <Nodes/>
        {/if}
    </div>
    {#if openFile}
        <div data-inline="-" style="width: 100%; justify-content: flex-end">
            <button
                    data-view-header-button="-"
                    on:click={openSourceCode}
            >
                <Icon styles="font-size: .9rem">code</Icon>
                <ToolTip content={LOCALIZATION_EN.SOURCE}/>
            </button>
        </div>
    {/if}
</ViewHeader>