<script>
    import LINK_WIDTH from "../../data/LINK_WIDTH";
    import NODE_TYPES from "../../data/NODE_TYPES";
    import NODE_INFO from "../../data/NODE_INFO";
    import getBezierCurve from "../../utils/get-bezier-curve";
    import dragNode from "../../utils/drag-node";
    import {onDestroy, onMount} from "svelte";
    import NodeInput from "./NodeInput.svelte";
    import NodeOutput from "./NodeOutput.svelte";

    export let links
    export let node
    export let handleLink
    export let selected
    export let setSelected
    export let submitNodeVariable
    export let canvas
    let pathRef
    let ref

    $: isSelected = selected.indexOf(node.id) > -1

    let height
    let outputLinks
    let inputLinks
    $: {
        const out = [], inp = []
        links.filter(l => {
            if (l.source.includes(node.id))
                out.push(l)
            if (l.target.includes(node.id))
                inp.push(l)
        })
        outputLinks = out
        inputLinks = inp
    }

    let nodeInfo
    $: {
        let key = (Object.entries(NODE_TYPES).find(([, value]) => value === node.type))
        if (key)
            nodeInfo = key[0]
        nodeInfo = NODE_INFO[key] ? NODE_INFO[key] : {}
    }
    const handleLinkDrag = (event) => {
        const scale = window.blueprints.scale
        const parent = ref?.parentNode.parentNode
        const bBox = event.currentTarget.getBoundingClientRect()
        let parentBBox = parent.getBoundingClientRect()
        const bounding = {
            x: parent.scrollLeft - parentBBox.left,
            y: parent.scrollTop - parentBBox.top
        }

        const curve = getBezierCurve(
            {
                x: (bBox.x + bounding.x + 7.5) / scale,
                y: (bBox.y + bounding.y + 7.5 + LINK_WIDTH * 2) / scale
            },
            {
                x1: (event.clientX + bounding.x + 7.5) / scale,
                y1: (event.clientY + bounding.y + 7.5 + LINK_WIDTH * 2) / scale
            })

        pathRef?.setAttribute("d", curve)
    }

    const handleDragStart = (event) => {
        let isFirst, alreadyFound = false
        if (!ref.contains(event.target))
            return

        document.elementsFromPoint(event.clientX, event.clientY)
            .forEach(e => {
                if (e.id?.includes("-node") && !alreadyFound && e.id === (node.id + "-node"))
                    isFirst = true
                else if (e.id?.includes("-node") && !alreadyFound)
                    alreadyFound = true
            })

        if (event.button === 0 && isFirst && !isSelected)
            setSelected(node.id, event.ctrlKey)
        if (event.button === 0 && ((isSelected && event.ctrlKey) || isFirst)) {
            dragNode(event, ref, ref.parentNode.parentNode)
        }
    }

    onMount(() => {
        if (!height) {
            const h = ref.firstChild.scrollHeight + 4
            height = h >= 35 ? h : 55
        }
        canvas.addEventListener("mousedown", handleDragStart)
    })
    onDestroy(() => canvas.removeEventListener("mousedown", handleDragStart))

    let width
    $: {
        switch (node.size) {
            case 0:
                width = "225px"
                break
            case 1:
                width = "150px"
                break
            default:
                width = "135px"
                break
        }
    }


</script>

<g>
    <g
            bind:this={ref}
            transform={`translate(${node.x} ${node.y})`}
    >
        <foreignObject
                data-node={node.canBeDeleted ? node.id : undefined}
                id={node.id}
                on:mousedown={(e) => setSelected(node.id, e.ctrlKey)}
                class="wrapper"
                style={isSelected ? "outline: yellow 2px solid" : undefined}
                width="{width}"
                height="{height}"
        >
            <div
                    class="label"
                    style="border-color: {nodeInfo.COLOR}"
                    id={node.id + "-node"}
            >
                {node.name}
            </div>
            <div class="content">
                <div
                        class="column"
                        style={node.output.length > 0  ? `max-width: calc(${width} - 75px)` : "width: 100%"}>
                    {#each node.inputs as a, i}
                        <NodeInput
                                handleLink={handleLink}
                                attribute={a}
                                node={node}
                                inputLinks={inputLinks}
                                submitNodeVariable={submitNodeVariable}
                        />
                    {/each}
                </div>
                {#if node.output.length > 0}
                    <div
                            class="column"
                            style="justify-content: flex-end; width: 50%"
                    >
                        {#each node.output as a, i}
                            <NodeOutput
                                    onDragEnd={() => pathRef.setAttribute("d", undefined)}
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
            bind:this={pathRef}
            fill={"none"}
            stroke={"var(--pj-accent-color)"}
            stroke-width={LINK_WIDTH}
            stroke-dasharray={"3,3"}
            d=""></path>
</g>

<style>
    .wrapper {
        overflow: visible;
        box-shadow: var(--pj-boxshadow);
        background: var(--pj-background-secondary);
        transition: outline 150ms linear;
        outline: transparent 2px solid;
        position: relative;
        border-radius: 3px;
        min-height: 35px;
        border: var(--pj-border-primary) 1px solid;
    }


    .label {
        cursor: grab;
        height: 30px;
        display: flex;
        border-radius: 3px 3px 0 0;
        align-items: center;
        gap: 3px;
        padding: 0 4px;
        font-weight: 550;
        font-size: 0.7rem;
        color: var(--pj-color-secondary);
        border-left: transparent 3px solid;
        background: var(--pj-background-primary);
        border-bottom: var(--pj-border-primary) 1px solid;
        transition: color 150ms linear;
    }

    .label:active {
        cursor: grabbing;
    }

    .content {
        display: flex;
        height: calc(100% - 30px);
        overflow: visible;
        border-radius: 0 0 3px 3px;
        background-color: var(--pj-background-primary);
    }

</style>