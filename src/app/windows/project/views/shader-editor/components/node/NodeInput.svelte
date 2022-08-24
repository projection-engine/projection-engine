<script>
    import linkNodes from "../../utils/link-nodes"
    import DATA_TYPES from "../../../../libs/engine/production/data/DATA_TYPES"
    import Attribute from "./Attribute.svelte";
    import "../../css/NodeIO.css"
    import dragDrop from "../../../../../../components/drag-drop";
    import {onDestroy, onMount} from "svelte";

    export let handleLink
    export let attribute
    export let inputLinks

    export let node
    export let submitNodeVariable

    const draggable = dragDrop(false)
    onMount(() => {
        if (attribute.accept)
            draggable.onMount({
                targetElement: document.getElementById(node.id + attribute.key),
                onDragOver: (data) => {
                    if (attribute.accept.includes(data.type) || attribute.accept.includes(DATA_TYPES.ANY))
                        return "<span data-icon='-' style='font-size: 20px'>check</span>"
                    return "<span data-icon='-' style='font-size: 20px'>clear</span>"
                },
                onDrop: (data) => {
                    console.trace(data)
                    if (!attribute.disabled)
                        linkNodes(data, attribute, node, handleLink)
                }
            })
    })
    onDestroy(() => {
        if (attribute.accept) draggable.onDestroy()
    })
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
