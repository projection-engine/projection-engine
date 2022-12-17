<script>
    import getBezierCurve from "../../utils/get-bezier-curve";
    import dragNode from "../../utils/drag-node";
    import NodeInput from "./NodeInput.svelte";
    import NodeOutput from "./NodeOutput.svelte";
    import Material from "../../libs/nodes/Material";
    import SelectionStore from "../../../../stores/SelectionStore";
    import ShaderEditorTools from "../../libs/ShaderEditorTools";
    import Icon from "frontend/shared/components/icon/Icon.svelte"

    export let links
    export let node
    export let selectionMap
    export let setSelected
    export let internalID

    let ref
    let isHidden = false
    $: isSelected = selectionMap.get(node.id) != null

    let outputLinks
    let inputLinks
    $: {
        const out = [], inp = []
        for (let i = 0; i < links.length; i++) {
            const current = links[i]
            if (current.source.includes(node.id))
                out.push(current)
            if (current.target.includes(node.id))
                inp.push(current)
        }

        outputLinks = out
        inputLinks = inp
    }

    let target, canvas
    let initialized = false
    const handleLinkDrag = (event) => {
        const draggableElement = event.currentTarget
        if (!target) {
            target = document.getElementById(node.id + "-path")
            canvas = document.getElementById(internalID)
        }
        const scale = ShaderEditorTools.scale
        const bBox = draggableElement.getBoundingClientRect()
        let parentBBox = canvas.getBoundingClientRect()
        const bounding = {
            x: canvas.scrollLeft - parentBBox.left,
            y: canvas.scrollTop - parentBBox.top
        }

        const curve = getBezierCurve(
            {
                x: (bBox.x + bounding.x + 7.5) / scale,
                y: (bBox.y + bounding.y + 7.5) / scale
            },
            {
                x1: (event.clientX + bounding.x + 7.5) / scale,
                y1: (event.clientY + bounding.y + 7.5) / scale
            })
        target.setAttribute("d", curve)
    }


    const handleDragStart = (event) => {
        if (event.button !== 0)
            return
        if (!SelectionStore.map.get(node.id))
            setSelected(node, event.ctrlKey)
        ref.linksToUpdate = [...inputLinks, ...outputLinks]

        dragNode(event, ref.parentElement, node.CONTEXT_ID)
    }
    $: {
        if (ref && (isHidden || !isHidden)) { // trigger in all state changes
            const links = [...inputLinks, ...outputLinks]
            ref.linksToUpdate = links
            setTimeout(() => {
                for (let i = 0; i < links.length; i++)
                    links[i].updatePath()
            }, 150)
        }
    }

    $: {
        if (ref) {
            let width
            switch (node.size) {
                case 0:
                    width = "225px"
                    break
                case 1:
                    width = "175px"
                    break
                default:
                    width = "150px"
                    break
            }

            initialized = true
            const m = Math.max(node.output.length, node.inputs.length)
            const height = m * 28 + 30
            ref.firstChild.setAttribute("height", `${isHidden ? 30 : height}`)
            ref.firstChild.setAttribute("width", `${width}`)
        }
    }
    $: isMat = node instanceof Material

</script>


<g
        bind:this={ref}
        data-ismaterial={isMat ? "true" : undefined}
        transform={`translate(${node.x} ${node.y})`}
>
    <foreignObject
            width="0"
            height="0"
            data-id={node.id}
            data-node={node.canBeDeleted ? node.id : undefined}
            id={node.id}
            class="wrapper"
            style={isSelected ? "outline: yellow 2px solid" : undefined}
    >
        <div
                class="label"
                data-inline="-"
                id={node.id + "-node"}
                on:mousedown={handleDragStart}
                style="justify-content: space-between"
                class:hidden-wrapper={isHidden}
        >
            {node.name}
            <button on:click={() => isHidden = !isHidden} data-view-header-button="-">
                <Icon styles={`transform: ${isHidden ? "none" : "rotate(-90deg)"}; font-size: 1rem`}>expand_more</Icon>
            </button>
        </div>
        <div
                class="content"
                class:hidden-content={isHidden}
             on:click={event => setSelected(node, event.ctrlKey)}
        >
            <div
                    class:hidden={isHidden}
                    style={node.output.length > 0  ? `max-width: 75%; width: 75%; overflow-x: hidden;` : "width: calc(100% - 4px)"}>
                {#each node.inputs as a, i}
                    <NodeInput
                            isHidden={isHidden}
                            attribute={a}
                            node={node}
                            inputLinks={inputLinks}
                    />
                {/each}
            </div>
            {#if node.output.length > 0}
                <div
                        class:hidden={isHidden}
                        style="justify-content: flex-end; max-width:75%;">
                    {#each node.output as a, i}
                        <NodeOutput
                                isHidden={isHidden}
                                data={a}
                                node={node}
                                handleLinkDrag={handleLinkDrag}
                                inputLinks={inputLinks}
                                outputLinks={outputLinks}
                        />
                    {/each}
                </div>
            {/if}
        </div>
    </foreignObject>
</g>
<path
        id={node.id + "-path"}
        fill={"none"}
        stroke={"var(--pj-accent-color)"}
        stroke-width={2}
        stroke-dasharray={"3,3"}
        d=""
></path>


<style>
    .hidden-content{
        position: absolute;
        top: 0;
        background: transparent !important;
        z-index: -1;
        width: 100%;
        height: 100% !important;
    }
    .hidden {
        position: absolute;
        top: 0;
        width: 100% !important;
        overflow: hidden;
        max-width: unset !important;
        visibility: hidden;
    }

    .hidden-wrapper {
        padding: 0 27px;
    }

    .wrapper {
        overflow: visible;
        box-shadow: var(--pj-boxshadow);
        background: var(--pj-background-primary);
        outline: transparent 2px solid;
        position: relative;
        border-radius: 3px;
        min-height: 35px;

        color: var(--pj-color-secondary);
        border: var(--pj-border-primary) 1px solid;
    }


    .label {
        cursor: grab;
        max-height: 30px;
        min-height: 30px;
        display: flex;
        border-radius: 3px 3px 0 0;
        align-items: center;

        padding: 0 4px;
        font-weight: 500;
        font-size: 0.7rem;
    }

    .label:active {
        cursor: grabbing;
    }

    .content {

        display: flex;
        height: calc(100% - 30px);
        overflow: visible;
        border-radius: 0 0 3px 3px;
        background-color: var(--pj-background-secondary);
        justify-content: space-between;
    }

</style>