<script>

    import {v4} from "uuid";
    import Comment from "./node/Comment.svelte";
    // import Node from "./node/UINode.svelte";
    import LINK_WIDTH from "../data/LINK_WIDTH";
    import SelectBox from "../../../../../components/select-box/SelectBox.svelte";
    import handleBoardScroll from "../utils/handle-board-scroll";
    import handleDropNode from "../utils/handle-drop-node";
    import handleDropBoard from "../utils/handle-drop-board";
    import BOARD_SIZE from "../data/BOARD_SIZE";
    import getContextMenu from "../utils/get-context-menu";
    import {onDestroy, onMount} from "svelte";
    import Node from "./node/Node.svelte";
    import resolveLinks from "../utils/resolve-links";
    import onMutation from "../libs/on-mutation";
    import bindContextTarget from "../../../../../components/context-menu/libs/bind-context-target";
    import handleLink from "../utils/handle-link";
    import ShaderEditorController from "../ShaderEditorController";
    import SelectionStore from "../../../stores/SelectionStore";

    export let links
    export let setLinks
    export let nodes
    export let setNodes
    export let selected
    export let submitNodeVariable
    export let isOpen

    const TRIGGERS = [
        "data-node",
        "data-board",
        "data-link",
        "data-group"
    ]

    let ref
    let internalID = v4()
    let dragType
    $: resolvedLinks = resolveLinks(links)


    const handleWheel = (e) => {
        e.preventDefault()
        let s = ShaderEditorController.scale
        if (e.wheelDelta > 0 && s < 3)
            s += s * .1
        else if (e.wheelDelta < 0 && s >= .5)
            s -= s * .1

        ref.style.transform = "scale(" + s + ")"
        ShaderEditorController.scale = s
    }


    const mutationObserver = new MutationObserver(e => onMutation(resolvedLinks, ref, e))
    const contextMenuBinding = bindContextTarget(internalID, TRIGGERS)
    $: contextMenuBinding.rebind(getContextMenu(
        nodes,
        setNodes,

        selected,
        links,
        setLinks,
        ref?.parentElement
    ))

    onMount(() => {

        if (ref && ref.parentElement) {
            ref.parentElement.scrollTop = BOARD_SIZE / 2
            ref.parentElement.scrollLeft = BOARD_SIZE / 2
            ref.parentElement.addEventListener("wheel", handleWheel, {passive: false})
        }
        mutationObserver.observe(ref, {subtree: true, childList: true, attributes: true})
    })

    onDestroy(() => {
        contextMenuBinding.onDestroy()
        if (ref && ref.parentElement)
            ref.parentElement.removeEventListener("wheel", handleWheel, {passive: false})
        mutationObserver.disconnect()
    })
    let timeout
    $: {
        // console.log(links)
        clearTimeout(timeout)
        timeout = setTimeout(() => onMutation(resolvedLinks, ref, []), 250)
    }
    const setSelected = (i, multi) => {
        if (multi)
            SelectionStore.shaderEditorSelected = [...SelectionStore.shaderEditorSelected, i]
        else
            SelectionStore.shaderEditorSelected = [i]
    }
</script>

<div class="wrapper">
    <SelectBox
            nodes={nodes}
            selected={selected}
            targetElementID={internalID}
            setSelected={v => SelectionStore.shaderEditorSelected = v}
    />

    <svg
            id={internalID}
            on:dragover={e => e.preventDefault()}
            on:contextmenu={e => e.preventDefault()}

            data-board={"BOARD"}
            style="height: {BOARD_SIZE}px;width: {BOARD_SIZE}px"
            on:drop={event => {
               event.preventDefault()
                console.log(isOpen)
                if(isOpen){

                const foundNodes = handleDropBoard(event.dataTransfer.getData("text"))
                if (foundNodes)
                    handleDropNode(foundNodes, event, ref, nodes, setNodes)
                }
            }}
            bind:this={ref}
            class="board"
            on:mousedown={e => {
                if(isOpen){
                if (e.button === 2)
                    handleBoardScroll(ref.parentNode)
                if (e.target === ref)
                    SelectionStore.shaderEditorSelected = []
                }
            }}
    >
        {#if isOpen}
            {#each nodes as node}
                {#if node.isComment}
                    <Comment
                            canvas={ref}
                            onDrag={{setDragType: v => dragType = v, dragType}}
                            setSelected={setSelected }
                            submitName={newName => {
                                    setNodes(nodes.map(p => {
                                            if (p.id === node.id)
                                                p.name = newName

                                            return p
                                        }))
                                }}
                            selected={selected}
                            node={node}
                    />
                {/if}
            {/each}
            {#each resolvedLinks as l}
                <path
                        data-link={l.target + "-" + l.source}
                        fill={"none"}
                        stroke={"#fff"}
                        stroke-width={LINK_WIDTH}
                        id={l.target + "-" + l.source}
                        d=""
                ></path>
            {/each}
            {#each nodes as node}
                {#if !node.isComment }
                    <Node
                            canvas={ref}
                            onDrag={{setDragType: v => dragType = v, dragType}}
                            links={resolvedLinks}
                            setSelected={setSelected}
                            selected={selected}
                            node={node}
                            handleLink={(src, target) => handleLink(src, target, links, setLinks)}
                            submitNodeVariable={submitNodeVariable}
                    />
                {/if}
            {/each}
        {/if}
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
        background: var(--pj-background-tertiary) radial-gradient(var(--pj-border-primary) 1px, transparent 0);
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