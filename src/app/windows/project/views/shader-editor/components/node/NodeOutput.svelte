<script>
    import DATA_TYPES from "../../../../libs/engine/data/DATA_TYPES";
    import "../../css/NodeIO.css"

    export let handleLinkDrag
    export let onDragEnd
    export let data
    export let outputLinks
    export let inputLinks
    export let node
    export let onDrag
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
</script>
<div
        data-link={link ? (link.target + "-" + link.source) : null}
        class="attribute node-io" bind:this={wrapperRef}
        data-dtype={"output"}
        data-disabled={`${data.disabled || data.type === DATA_TYPES.UNDEFINED && (inputLinks.length === 0 && node.inputs.length > 0)}`}
        style="justify-content: flex-end">
    <div
            data-overflow="-"
            style={`color: ${data.disabled ? "#999" : data.color}; font-weight: bold`}
    >
        {data.label}
    </div>
    <span
            id={node.id + data.key}
            class="connection node-io"

            draggable={!(data.type === DATA_TYPES.UNDEFINED && (inputLinks.length === 0 && node.inputs.length > 0)) ? "true" : undefined}
            data-dtype={"output"}
            data-disabled={`${data.disabled || data.type === DATA_TYPES.UNDEFINED && (inputLinks.length === 0 && node.inputs.length > 0)}`}
            data-highlight={link ? "-" : undefined}
            on:dragend={onDragEnd}
            on:drag={handleLinkDrag}
            on:dragstart={e => {
                if (!data.disabled) {
                    const nType = data.type === DATA_TYPES.UNDEFINED ? (inputLinks.length === 1 ? inputLinks[0]?.sourceType : getPredominant(inputLinks)) : undefined
                    const attribute = data.type === DATA_TYPES.UNDEFINED ? {
                        ...data,
                        type: nType
                    } : data
                    e.dataTransfer
                        .setData(
                            "text",
                            JSON.stringify({
                                id: node.id,
                                type: "output",
                                attribute
                            })
                        )
                    onDrag.setDragType(attribute.type)
                } else
                    e.preventDefault()
            }}
    ></span>
</div>

