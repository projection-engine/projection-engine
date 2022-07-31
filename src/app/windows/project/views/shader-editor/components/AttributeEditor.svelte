<script>

    import Input from "../../../../../components/input/Input.svelte";
    import ColorPicker from "../../../../../components/color-picker/ColorPicker.svelte";
    import Material from "../templates/nodes/Material";
    import Attribute from "./node/Attribute.svelte";

    export let selected
    export let nodes
    export let updateNode
    export let submitNodeVariable
    export let translate
    let selectedNode
    $: {
        const index = nodes.findIndex(n => (selected ? n.id === selected : n instanceof Material))
        selectedNode = nodes[index]
    }
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
                <Attribute
                        attribute={attr}
                        node={selectedNode}
                        handleChange={(...attrData) => submitNodeVariable(...attrData, selected)}
                        returnDefault={false}
                />
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
