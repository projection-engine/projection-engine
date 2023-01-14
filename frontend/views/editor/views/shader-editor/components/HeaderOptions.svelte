<script>
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import ShaderEditorTools from "../libs/ShaderEditorTools";
    import Selector from "../../../../../components/selector/Selector.svelte";
    import ToolTip from "../../../../../components/tooltip/ToolTip.svelte";
    import Icon from "../../../../../components/icon/Icon.svelte";
    import ViewHeader from "../../../../../components/view/components/ViewHeader.svelte";
    import addComment from "../utils/add-comment";


    export let openFile
    // export let compile
    export let initializeFromFile
    export let nodes
    export let openSourceCode
    export let canvasAPI

    $: activeGrid = ShaderEditorTools.grid = ShaderEditorTools.GRID_SIZE
</script>

<ViewHeader>
    <div data-inline="-" style="width: 100%">
        <button
                disabled={!openFile}
                data-view-header-button="-"
                style="max-width: unset"
                on:click={() => ShaderEditorTools.save(canvasAPI).catch()}>
            <Icon styles="font-size: .9rem">save</Icon>
            {LOCALIZATION_EN.SAVE}
        </button>
<!--        <div data-vertdivider="-"></div>-->
<!--        <button-->
<!--                disabled={!openFile}-->
<!--                data-view-header-button="-"-->
<!--                style="max-width: unset"-->
<!--                on:click={compile}-->
<!--        >-->
<!--            <Icon styles="font-size: .9rem">code</Icon>-->
<!--            {LOCALIZATION_EN.COMPILE}-->
<!--        </button>-->
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
    </div>
    {#if openFile}
        <div data-inline="-" style="width: 100%; justify-content: flex-end">
            <button
                    data-view-header-button="-"
                    on:click={() => addComment(canvasAPI)}
            >
                <Icon styles="font-size: .9rem">chat_bubble_outline</Icon>
                <ToolTip content={LOCALIZATION_EN.ADD_COMMENT}/>
            </button>
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