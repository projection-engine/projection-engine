<script>
    import DATA_TYPES from "../../../../libs/engine/production/data/DATA_TYPES";
    import "../../css/NodeIO.css"
    import dragDrop from "../../../../../../components/drag-drop";
    import {onDestroy, onMount} from "svelte";

    export let handleLinkDrag
    export let onDragEnd
    export let data
    export let outputLinks
    export let inputLinks
    export let node
    let wrapperRef
    $: link = outputLinks.find(o => o.sourceKey === data.key)

    function getPredominant([a, b]) {
        const aType = a.sourceType, bType = b.sourceType
        if (aType === bType)
            return aType
        if (aType === DATA_TYPES.FLOAT && bType.toString().includes("vec"))
            return bType
        return aType
    }

    const draggable = dragDrop(true)
    onMount(() => {
        draggable.onMount({
            targetElement: document.getElementById(node.id + data.key),
            onMouseMove: handleLinkDrag,
            onDragStart: () => {
                const nType = data.type === DATA_TYPES.UNDEFINED ? (inputLinks.length === 1 ? inputLinks[0]?.sourceType : getPredominant(inputLinks)) : undefined
                return {
                    ...data,
                    type:data.type === DATA_TYPES.UNDEFINED  ?  nType : data.type,
                    nodeID: node.id
                }
            },
            onDragEnd
        })
    })
    $: draggable.disabled = (data.type === DATA_TYPES.UNDEFINED && (inputLinks.length === 0 && node.inputs.length > 0))
    onDestroy(() => draggable.onDestroy())
</script>
<div
        data-link={link ? (link.target + "-" + link.source) : null}
        class="attribute node-io" bind:this={wrapperRef}
        data-dtype={"output"}
        data-disabled={`${data.disabled || data.type === DATA_TYPES.UNDEFINED && (inputLinks.length === 0 && node.inputs.length > 0)}`}
        style="justify-content: flex-end">
    <div
            data-overflow="-"
            style={`color: ${data.disabled ? "#999" : data.color};`}
    >
        {data.label}
    </div>
    <span
            id={node.id + data.key}
            class="connection node-io"


            data-dtype={"output"}
            data-disabled={`${data.disabled || data.type === DATA_TYPES.UNDEFINED && (inputLinks.length === 0 && node.inputs.length > 0)}`}
            data-highlight={link ? "-" : undefined}
    ></span>
</div>

