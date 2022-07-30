<script>
    import ToolTip from "../../../../../../components/tooltip/ToolTip.svelte";
    import Output from "./Output.svelte";
    import Input from "../../../../../../components/input/Input.svelte";
    import LINK_WIDTH from "../../data/LINK_WIDTH";

    export let links
    export let node
    export let handleLink
    export let selected
    export let setSelected
    let pathRef

    nodeInfo
    width
    ref
    handleLinkDrag
    height
    pathRef
    outputLinks
    inputLinks
    isSelected


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
                <ToolTip content={nodeInfo.LABEL}/>
                {node.name}
            </div>
            <div class="content">
                <div class="column" style={node.output.length > 0  ? `maxWidth: calc(${width} - 75px)` : undefined}>
                    {#each node.inputs as a, i}
                        <Input
                                handleLink={handleLink}
                                attribute={a}
                                node={node}
                                inputLinks={inputLinks}
                        />
                    {/each}
                </div>
                {#if node.output.length > 0}
                    <div
                            class={column}
                            style={{justifyContent: "flex-end", width: "50%"}}
                    >
                        {#each node.output as a, i}
                            <Output
                                    onDragEnd={() => pathRef.current.setAttribute("d", undefined)}
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
