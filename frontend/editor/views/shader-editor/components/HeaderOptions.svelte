<script>
    import Nodes from "./Nodes.svelte"
    import selection from "../utils/selection"
    import SELECTION_TYPES from "../static/SELECT_ACTIONS"

    import LOCALIZATION_EN from "../../../templates/LOCALIZATION_EN";
    import ShaderEditorTools from "../libs/ShaderEditorTools";
    import Selector from "../../../components/selector/Selector.svelte";
    import getDropdownHeaderStyles from "../../../utils/get-dropdown-header-styles";
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import Dropdown from "../../../../shared/components/dropdown/Dropdown.svelte";

    export let save
    export let openFile
    export let compile
    export let initializeFromFile
    export let nodes
    export let openSourceCode
    $: activeGrid = ShaderEditorTools.grid = ShaderEditorTools.GRID_SIZE
</script>

<div data-inline="-" style="width: 100%">
    <button
            disabled={!openFile}
            data-view-header-button="-"
            style="max-width: unset"
            on:click={save}>
        <Icon styles="font-size: .9rem">save</Icon>
        {LOCALIZATION_EN.SAVE}
    </button>
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
            styles="max-width: 20vw;"
            mergeMaterials={false}
            size="small"
            type="material"
            noDefault="true"
            handleChange={initializeFromFile}
            selected={openFile}
    />

    {#if openFile}
        <Nodes/>
        <Dropdown buttonStyles={getDropdownHeaderStyles()}>
            <button slot="button" data-view-header-dropdown="-">
                {LOCALIZATION_EN.SELECT}
            </button>

            <button on:click={ () => selection(SELECTION_TYPES.ALL, nodes )}>
                {LOCALIZATION_EN.ALL}
            </button>

            <button on:click={ () => selection(SELECTION_TYPES.NONE, nodes )}>
                {LOCALIZATION_EN.NONE}
            </button>

            <button on:click={ () => selection(SELECTION_TYPES.INVERT, nodes )}>
                {LOCALIZATION_EN.INVERT}
            </button>
        </Dropdown>
    {/if}
</div>

<div data-inline="-" style="width: 100%; justify-content: flex-end">
    <button
            data-view-header-button="-"
            style="max-width: unset"
            data-highlight={activeGrid ? "-" : undefined}
            on:click={e => {
                if (ShaderEditorTools.grid === ShaderEditorTools.GRID_SIZE) {
                    ShaderEditorTools.grid = 1
                    e.currentTarget.setAttribute("data-highlight", "")

                } else {
                    ShaderEditorTools.grid = ShaderEditorTools.GRID_SIZE
                    e.currentTarget.setAttribute("data-highlight", "-")

                }
            }}
    >
        <Icon styles="font-size: .9rem">grid_4x4</Icon>
        <ToolTip content={LOCALIZATION_EN.TOGGLE_GRID}/>
    </button>
    {#if openFile}
        <button
                data-view-header-button="-"
                on:click={openSourceCode}
        >
            <Icon styles="font-size: .9rem">code</Icon>
            <ToolTip content={LOCALIZATION_EN.SOURCE}/>
        </button>
    {/if}
</div>