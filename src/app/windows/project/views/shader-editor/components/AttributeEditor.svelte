<script>
    import getNodeInput from "../utils/get-node-input"
    import EnglishLocalization from "../../../../../static/EnglishLocalization";
    import Input from "../../../../../components/input/Input.svelte";
    import ColorPicker from "../../../../../components/color-picker/ColorPicker.svelte";
    import Material from "../templates/nodes/Material";

    export let selected
    export let nodes
    export let updateNode
    export let submitNodeVariable

    let selectedNode
    $: {
        const index = nodes.findIndex(n => (selected ? n.id === selected : n instanceof Material))
        selectedNode = nodes[index]
    }
    const translate = key => EnglishLocalization.PROJECT.SHADER_EDITOR[key]
</script>

<div class="contentWrapper">
    <div class="wrapper">
        <Input
                searchString={selectedNode.name}
                width={"100%"}
                height={"30px"}
                setSearchString={ev => updateNode("name", ev, selectedNode)}
                placeholder={translate("NAME")}
        />
        {#each selectedNode.inputs as attr, i}
            {#if !attr.accept}
                {getNodeInput(attr, selectedNode, (...attrData) => submitNodeVariable(...attrData, selected))}
            {/if}
        {/each}
        {#if selectedNode.isComment}
            <div>{translate("COLOR")}</div>
            <ColorPicker
                    submit={(_, arr) => {
                    updateNode("color", [...arr, .5], selectedNode)
                }}
                    value={selectedNode.color}
                    size={"small"}
            />
        {/if}
    </div>
</div>
