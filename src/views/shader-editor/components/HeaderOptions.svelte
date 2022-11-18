<script>
    import Nodes from "./../components/Nodes.svelte"
    import selection from "./../utils/selection"
    import SELECTION_TYPES from "./../static/SELECT_ACTIONS"

    import LOCALIZATION_EN from "../../../templates/LOCALIZATION_EN";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";

    import ShaderEditorTools from "./../libs/ShaderEditorTools";
    import Selector from "../../../components/selector/Selector.svelte";

    export let save
    export let openFile
    export let compile
    export let initializeFromFile
    export let nodes
    export let openSourceCode

</script>

<div data-inline="-" style="width: 100%">
    <button
            disabled={!openFile}
            class="button"
            on:click={save}>
        <Icon styles="font-size: .9rem">save</Icon>
        {LOCALIZATION_EN.SAVE}
    </button>
    <button
            disabled={!openFile}
            class="button"
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
    {/if}
</div>

<div data-inline="-" style="width: 100%; justify-content: flex-end">
    <Dropdown>
        <button class="button" slot="button">
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
    <button
            class="button"
            data-highlight="-"
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
                class="button"
                on:click={openSourceCode}
        >
            <Icon styles="font-size: .9rem">code</Icon>
            <ToolTip content={LOCALIZATION_EN.SOURCE}/>
        </button>
    {/if}
</div>