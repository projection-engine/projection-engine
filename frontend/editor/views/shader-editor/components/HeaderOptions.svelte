<script>

    import ShaderEditorTools from "../libs/ShaderEditorTools"
    import Selector from "../../../components/selector/Selector.svelte"
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte"
    import Icon from "../../../../shared/components/icon/Icon.svelte"
    import ViewHeader from "../../../components/view/components/ViewHeader.svelte"
    import LocalizationEN from "../../../../../shared/enums/LocalizationEN"
    import ShaderEditorUtil from "../../../util/ShaderEditorUtil"

    export let openFile
    export let initializeFromFile
    export let nodes
    export let openSourceCode
    export let canvasAPI

    $: activeGrid = ShaderEditorTools.grid = ShaderEditorTools.GRID_SIZE
</script>

<ViewHeader>
    <div data-svelteinline="-" style="width: 100%">
        <button data-sveltebuttondefault="-"
                disabled={!openFile}
                data-svelteview-header-button="-"
                style="max-width: unset"
                on:click={() => ShaderEditorTools.save(canvasAPI).catch(console.error)}>
            <Icon styles="font-size: .9rem">save</Icon>
            {LocalizationEN.SAVE}
        </button>

        <div data-sveltevertdivider="-"></div>
        <Selector
                styles={`max-width: ${openFile ? "10vw" : "15vw"};`}
                mergeMaterials={false}
                size="small"
                type="material"
                noDefault="true"
                handleChange={initializeFromFile}
                selected={openFile}
        />

    </div>
    {#if openFile}
        <div data-svelteinline="-" style="width: 100%; justify-content: flex-end">
            <button data-sveltebuttondefault="-"
                    data-svelteview-header-button="-"
                    style="max-width: unset"
                    on:click={() =>  canvasAPI.history.undo()}>
                <Icon styles="font-size: .9rem">undo</Icon>
                {LocalizationEN.UNDO}
            </button>

            <button data-sveltebuttondefault="-"
                    data-svelteview-header-button="-"
                    style="max-width: unset"
                    on:click={() => canvasAPI.history.redo()}>
                {LocalizationEN.REDO}
                <Icon styles="font-size: .9rem">redo</Icon>
            </button>
            <div data-sveltevertdivider="-"></div>
            <button data-sveltebuttondefault="-"
                    data-svelteview-header-button="-"
                    style="max-width: unset"
                    on:click={() => ShaderEditorUtil.addComment(canvasAPI)}
            >
                <Icon styles="font-size: .9rem">chat_bubble_outline</Icon>
                {LocalizationEN.ADD_COMMENT}
            </button>
            <button data-sveltebuttondefault="-"
                    data-svelteview-header-button="-"
                    on:click={openSourceCode}
            >
                <Icon styles="font-size: .9rem">code</Icon>
                <ToolTip content={LocalizationEN.SOURCE}/>
            </button>
        </div>
    {/if}
</ViewHeader>