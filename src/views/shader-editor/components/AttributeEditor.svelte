<script>
    import Input from "shared-resources/frontend/components/input/Input.svelte";
    import ColorPicker from "shared-resources/frontend/components/color-picker/ColorPicker.svelte";
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

{#if selectedNode}
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
                            handleChange={(value, attribute) => submitNodeVariable(value, attribute, selectedNode)}
                            returnDefault={false}
                    />
                {/if}
            {/each}
            {#if selectedNode.isComment}
                <div>{translate("COLOR")}</div>
                <ColorPicker
                        submit={({r,g,b}) => {
                        updateNode("color", [r, g, b, .5], selectedNode)
                    }}
                        value={selectedNode.color}
                        size={"small"}
                />
            {/if}
        </div>
    </div>
{/if}

<style>
    .contentWrapper {
        background: var(--pj-background-tertiary);
        overflow-y: auto;
        border-bottom-left-radius: 5px;
        border-top-left-radius: 5px;
        padding: 4px;
        max-height: 100%;
        overflow-x: hidden;
        width: 250px;
    }

    .wrapper {
        overflow-x: hidden;
        color: var(--pj-color-secondary);
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: .75rem;
    }

    .wrapper > * {
        border-radius: 3px;
        padding: 4px;
        width: 100%;
        background: var(--pj-background-primary);
    }

</style>