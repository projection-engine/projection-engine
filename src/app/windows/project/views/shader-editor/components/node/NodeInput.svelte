<script>
    import linkNodes from "../../utils/link-nodes"
    import DATA_TYPES from "../../../../../../../../public/engine/production/data/DATA_TYPES"
    import Attribute from "./Attribute.svelte";
    import "../../css/NodeIO.css"
    import ShaderEditorController from "../../ShaderEditorController";

    export let handleLink
    export let attribute
    export let inputLinks

    export let node
    export let submitNodeVariable
    $: link = attribute.accept ? inputLinks.find(o => o.targetKey === attribute.key) : undefined
    const onDrop = e => {
        if (!attribute.accept)
            return
        e.preventDefault()
        if (ShaderEditorController.connectionOnDrag) {
            document.getElementById(ShaderEditorController.connectionOnDrag.nodeID + "-path").setAttribute("d", "")
            if (!attribute.disabled)
                linkNodes(ShaderEditorController.connectionOnDrag, attribute, node, handleLink)
            ShaderEditorController.connectionOnDrag = undefined
        }
    }
</script>
<div
        data-link={link ? (link.target + "-" + link.source) : null}
        class="attribute node-io"

        data-dtype={"input"}
        data-disabled={`${attribute.disabled || attribute.type === DATA_TYPES.UNDEFINED && (inputLinks.length === 0 && node.inputs.length > 0)}`}
        style={attribute.accept ? "transform: translateX(var(--direction))" : undefined}
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
    {#if link}
        {attribute.label}
    {:else}
        <Attribute
                attribute={attribute}
                node={node}
                handleChange={(...attrData) => submitNodeVariable(...attrData, node)}
                returnDefault={true}
        />

    {/if}
</div>
