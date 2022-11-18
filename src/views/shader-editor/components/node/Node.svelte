<script>
    import getBezierCurve from "../../utils/get-bezier-curve";
    import dragNode from "../../utils/drag-node";
    import NodeInput from "./NodeInput.svelte";
    import NodeOutput from "./NodeOutput.svelte";
    import Material from "../../libs/nodes/Material";
    import SelectionStore from "../../../../stores/SelectionStore";
    import ShaderEditorTools from "../../libs/ShaderEditorTools";
    import SEContextController from "../../libs/SEContextController";

    export let links
    export let node
    export let selectionMap
    export let setSelected
    export let internalID


    let ref

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
        dragNode(event, ref.parentElement)
    }


    $: {
        if (!initialized) {
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

            if (ref) {
                initialized = true
                ref.firstChild.setAttribute("height", "0")
                setTimeout(() => {
                    const h = ref.firstChild.scrollHeight + 4
                    ref.firstChild.setAttribute("height", `${h >= 35 ? h : 55}`)
                    ref.firstChild.setAttribute("width", `${width}`)
                }, 0)
            }
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
            data-id={node.id}
            data-node={node.canBeDeleted ? node.id : undefined}
            id={node.id}
            class="wrapper"
            style={isSelected ? "outline: yellow 2px solid" : undefined}
    >
        <div
                class="label"
                id={node.id + "-node"}
                on:mousedown={handleDragStart}
        >
            {node.name}
        </div>
        <div class="content" on:click={event => setSelected(node, event.ctrlKey)}>
            <div
                    class="column"
                    style={node.output.length > 0  ? `max-width: 75%; width: 75%;` : "width: 100%"}>
                {#each node.inputs as a, i}
                    <NodeInput
                            attribute={a}
                            node={node}
                            inputLinks={inputLinks}
                    />
                {/each}
            </div>
            {#if node.output.length > 0}
                <div
                        class="column"
                        style="justify-content: flex-end; max-width:75%"
                >
                    {#each node.output as a, i}
                        <NodeOutput

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
        height: 30px;
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