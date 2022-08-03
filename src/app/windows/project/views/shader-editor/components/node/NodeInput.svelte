<script>
    import linkNodes from "../../utils/link-nodes"
    import DATA_TYPES from "../../../../libs/engine/data/DATA_TYPES"
    import Attribute from "./Attribute.svelte";
    import "../../css/NodeIO.css"

    export let handleLink
    export let attribute
    export let inputLinks
    export let onDrag
    export let node
    export let submitNodeVariable


    $: link = attribute.accept ? inputLinks.find(o => o.targetKey === attribute.key) : undefined

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
            on:drop={e => {
                e.preventDefault()
                onDrag.setDragType(undefined)
                if (!attribute.disabled)
                    linkNodes(e, attribute, node, handleLink)
            }}></span>
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
