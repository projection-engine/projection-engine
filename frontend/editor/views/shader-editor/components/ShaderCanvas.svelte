<script>

    import Comment from "./node/Comment.svelte";
    import SelectBox from "../../../components/select-box/SelectBox.svelte";
    import handleBoardScroll from "../utils/handle-board-scroll";
    import handleDropNode from "../utils/handle-drop-node";
    import handleDropBoard from "../utils/handle-drop-board";
    import BOARD_SIZE from "../static/BOARD_SIZE";
    import {onDestroy, onMount} from "svelte";
    import Node from "./node/Node.svelte";
    import SelectionStore from "../../../stores/SelectionStore";
    import HotKeysController from "../../../lib/utils/HotKeysController";
    import Link from "./Link.svelte";
    import SEContextController from "../libs/SEContextController";
    import handleWheelZoom from "../utils/handle-wheel-zoom";
    import initializeCanvas from "../utils/initialize-canvas";
    import ContextMenuController from "../../../../shared/libs/context-menu/ContextMenuController";

    const EMPTY_MAP = new Map()
    export let openFile

    let ctx
    let links = []
    let nodes = []
    let ref
    let selectionMap

    const unsubscribe = SelectionStore.getStore(() => {
        selectionMap = SelectionStore.data.TARGET === SelectionStore.TYPES.SHADER_EDITOR ? SelectionStore.map : EMPTY_MAP
    })


    function updateData() {
        nodes = ctx.getNodes()
        links = ctx.getLinks()
    }

    onMount(() => {
        ctx = SEContextController.getContext(openFile.registryID)
        initializeCanvas(
            openFile,
            ref,
            ctx,
            (n, l) => {
                nodes = n;
                links = l;
            }
        )
    })


    onDestroy(() => {
        unsubscribe()
        HotKeysController.unbindAction(ref)
        ContextMenuController.destroy(openFile.registryID)
        ref.parentElement.removeEventListener("wheel", handleWheelZoom)
    })


    const setSelected = (element, multi) => {
        if (multi)
            SelectionStore.shaderEditorSelected = [...SelectionStore.shaderEditorSelected, element]
        else
            SelectionStore.shaderEditorSelected = [element]
    }
</script>

<div class="wrapper">
    <SelectBox
            returnRefs={true}
            nodes={nodes}
            targetElementID={openFile.registryID}
            setSelected={v => SelectionStore.shaderEditorSelected = v}
    />

    <svg
            bind:this={ref}
            id={openFile.registryID}
            on:dragover={e => e.preventDefault()}
            on:contextmenu={e => e.preventDefault()}
            data-board={"BOARD"}
            style="position: relative; height: {BOARD_SIZE}px;width: {BOARD_SIZE}px"
            on:drop={event => {
                event.preventDefault()
                const foundNodes = handleDropBoard(event.dataTransfer.getData("text"))
                if (!foundNodes)
                    return
                handleDropNode(foundNodes, event, ref, nodes, ctx.updateNodes)
            }}
            class="board"
            on:mousedown={e => {
                if (e.button === 2)
                    handleBoardScroll(ref.parentNode)
                if (e.target === ref)
                    SelectionStore.shaderEditorSelected = []
            }}
    >
        {#each nodes as node}
            {#if node.isComment}
                <Comment
                        canvas={ref}
                        setSelected={setSelected}
                        submitName={newName => {
                             ctx.updateNodes(nodes.map(p => {
                                if (p.id === node.id)
                                    p.name = newName
                                return p
                            }))
                        }}
                        selectionMap={selectionMap}
                        node={node}
                />
            {/if}
        {/each}
        {#each links as link}
            <Link
                    data={link}
                    selectionMap={selectionMap}
                    setSelected={setSelected}
            />
        {/each}
        {#each nodes as node}
            {#if !node.isComment}
                <Node
                        internalID={openFile.registryID}
                        links={links}
                        setSelected={setSelected}
                        selectionMap={selectionMap}
                        node={node}

                />
            {/if}
        {/each}

    </svg>
</div>

<style>

    .board {
        left: 0;
        top: 0;
        z-index: 0;
        position: relative;
        box-shadow: var(--pj-boxshadow);
        color-rendering: optimizespeed;
        background: var(--pj-background-quaternary) radial-gradient(var(--pj-border-primary) 1px, transparent 0);
        background-size: 20px 20px;
        overflow: hidden;
        transform-origin: center center;
    }

    .wrapper {
        overflow: hidden !important;
        width: 100%;
        height: 100%;
        position: relative;
        border-radius: 5px 0 0 5px;
    }


</style>