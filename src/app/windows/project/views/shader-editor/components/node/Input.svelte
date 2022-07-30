<script>
    import linkNodes from "../../utils/link-nodes"
    import getNodeInput from "../../utils/get-node-input"

    export let handleLink
    export let attribute
    export let inputLinks
    export let onDrag
    export let node
    export let submitNodeVariable


    let wrapperRef
    $: link = attribute.accept ? inputLinks.find(o => o.targetKey === attribute.key)

</script>
<div
        data-link={link ? (link.target + "-" + link.source) : null}
        class="attribute"
        bind:this={wrapperRef}
        data-dtype={"input"}
        data-disabled={`${attribute.disabled || attribute.type === DATA_TYPES.UNDEFINED && (inputLinks.length === 0 && node.inputs.length > 0)}`}
        style={{transform: attribute.accept ? "translateX(var(--direction))" : undefined}}
>

    {#if attribute.accept}
        <div
            id={node.id + attribute.key}
            class="connection"
            data-dtype={"input"}
            data-disabled={`${attribute.disabled || attribute.type === DATA_TYPES.UNDEFINED && (inputLinks.length === 0 && node.inputs.length > 0)}`}
            data-highlight={link ? "-" : undefined}
            on:drop={e => {
                e.preventDefault()
                onDrag.setDragType(undefined)
                if (!attribute.disabled)
                    linkNodes(e, attribute, node, handleLink)
            }}></div>
    {/if}
    {#if link}
        {attribute.label}
        {:else}
        {getNodeInput(attribute, node, (...attrData) => submitNodeVariable(...attrData, node), true)}
    {/if}
</div>

