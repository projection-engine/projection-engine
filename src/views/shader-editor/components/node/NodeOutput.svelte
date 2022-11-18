<script>
    import DATA_TYPES from "../../../../../public/engine/static/DATA_TYPES";
    import "../../css/NodeIO.css"
    import ShaderEditorTools from "../../libs/ShaderEditorTools";

    export let handleLinkDrag
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

    $:  disabled = (data.type === DATA_TYPES.UNDEFINED && (inputLinks.length === 0 && node.inputs.length > 0))
    const endDrag = e => {
        e.preventDefault()
        if(ShaderEditorTools.connectionOnDrag)
            document.getElementById(ShaderEditorTools.connectionOnDrag.nodeID + "-path").setAttribute("d", "")
        ShaderEditorTools.connectionOnDrag  = undefined
    }
</script>
<div
        data-link={link?.identifier}
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
            draggable={!disabled ? "true" : undefined}
            on:dragstart={e => {
                const nType = data.type === DATA_TYPES.UNDEFINED ? (inputLinks.length === 1 ? inputLinks[0]?.sourceType : getPredominant(inputLinks)) : undefined
                ShaderEditorTools.connectionOnDrag = {
                    ...data,
                    type:data.type === DATA_TYPES.UNDEFINED  ?  nType : data.type,
                    nodeID: node.id
                }
            }}
            on:dragend={endDrag}
            on:drag={e => {
                handleLinkDrag(e)
            }}
            on:drop={endDrag}
            id={node.id + data.key}
            class="connection node-io"

            data-dtype={"output"}
            data-disabled={`${data.disabled || data.type === DATA_TYPES.UNDEFINED && (inputLinks.length === 0 && node.inputs.length > 0)}`}
            data-highlight={link ? "-" : undefined}
    ></span>
</div>

