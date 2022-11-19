<script>
    import linkNodes from "../../utils/link-nodes"
    import DATA_TYPES from "../../../../../public/engine/static/DATA_TYPES"
    import Attribute from "./Attribute.svelte";
    import "../../css/NodeIO.css"
    import ShaderEditorTools from "../../libs/ShaderEditorTools";
    import SEContextController from "../../libs/SEContextController";

    export let attribute
    export let inputLinks
    export let node
    export let isHidden


    $: link = attribute.accept ? inputLinks.find(o => o.targetKey === attribute.key) : undefined
    const onDrop = e => {
        if (!attribute.accept)
            return
        e.preventDefault()
        if (ShaderEditorTools.connectionOnDrag !== undefined) {
            document.getElementById(ShaderEditorTools.connectionOnDrag.nodeID + "-path").setAttribute("d", "")
            console.log(attribute)
            if (!attribute.disabled)
                linkNodes(attribute, node)
            ShaderEditorTools.connectionOnDrag = undefined
        }
    }
</script>
<div
        data-link={link?.identifier}
        class="attribute node-io"
        data-ishidden={isHidden ? "-" : undefined}
        data-dtype={"input"}
        data-disabled={`${attribute.disabled || attribute.type === DATA_TYPES.UNDEFINED && (inputLinks.length === 0 && node.inputs.length > 0)}`}
>

    {#if attribute.accept}
        <span
                id={node.id + attribute.key}
                class="connection node-io"
                data-dtype={"input"}
                data-disabled={`${attribute.disabled || attribute.type === DATA_TYPES.UNDEFINED && (inputLinks.length === 0 && node.inputs.length > 0)}`}
                data-highlight={link ? "-" : undefined}
                on:drop={onDrop}
                style="border-radius: 3px"

        ></span>
    {/if}
    {#if !isHidden}
        {#if link}
            {attribute.label}
        {:else}
            <Attribute
                    attribute={attribute}
                    node={node}
                    handleChange={(...attrData) => SEContextController.submitNodeVariable(...attrData, node)}
                    returnDefault={true}
            />

        {/if}
    {/if}
</div>
