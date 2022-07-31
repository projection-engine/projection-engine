<script>

    import {v4} from "uuid";
    import Comment from "./node/Comment.svelte";
    import Node from "./node/Node.svelte";
    import LINK_WIDTH from "../data/LINK_WIDTH";
    import SelectBox from "../../../../../components/select-box/SelectBox.svelte";
    import handleBoardScroll from "../utils/handle-board-scroll";
    import handleDropNode from "../utils/handle-drop-node";
    import handleDropBoard from "../utils/handle-drop-board";
    import BOARD_SIZE from "../data/BOARD_SIZE";
    import getContextMenu from "../utils/get-context-menu";
    import {onDestroy, onMount} from "svelte";
    import updateLinks from "../utils/update-links";

    const TRIGGERS = [
        "data-node",
        "data-board",
        "data-link",
        "data-group"
    ]

    let ref
    let internalID = v4()


    let mappedLinks = []
    let dragType
    $: links = hook.links.map(l => {
        return {
            target: l.target.id + l.target.attribute.key,
            source: l.source.id + l.source.attribute.key,
            targetKey: l.target.attribute.key,
            sourceKey: l.source.attribute.key,

            sourceType: l.source.attribute.type,
            targetType: l.target.attribute.type
        }
    })


    const handleWheel = (e) => {
        e.preventDefault()
        let s = window.blueprints.scale
        if (e.wheelDelta > 0 && s < 3)
            s += s * .1
        else if (e.wheelDelta < 0 && s >= .5)
            s -= s * .1

        ref.style.transform = "scale(" + s + ")"
        window.blueprints.scale = s
        updateLinks(mappedLinks)
    }

    $: boardOptions = getContextMenu(
        (nodes, event) => handleDropNode(nodes, event, ref, hook),
        hook,
        links,
        (t) => {
            hook.setLinks(prev => {
                return prev.filter(l => {
                    const test = {
                        t: l.target.id + l.target.attribute.key,
                        s: l.source.id + l.source.attribute.key,
                    }
                    return (test.t + "-" + test.s) !== t
                })
            })
        }
    )


    const mutationObserver = new MutationObserver(() => updateLinks(mappedLinks))
    onMount(() => {
        if (ref && ref.parentElement) {
            ref.parentElement.scrollTop = BOARD_SIZE / 2
            ref.parentElement.scrollLeft = BOARD_SIZE / 2
            ref.parentElement.addEventListener("wheel", handleWheel, {passive: false})
        }

        mutationObserver.observe(ref, {subtree: true, childList: true, attributes: true})
    })
    onDestroy(() => {
        if (ref && ref.parentElement)
            ref.parentElement.removeEventListener("wheel", handleWheel, {passive: false})
        mutationObserver.disconnect()
    })


    $: {
        if (mappedLinks.length !== links.length)
            mappedLinks = links.map(l => {
                const linkPath = document.getElementById(l.target + "-" + l.source)
                return {
                    target: document.getElementById(l.target),
                    source: document.getElementById(l.source),
                    linkPath
                }
            })
        updateLinks(mappedLinks)
    }
</script>

<div class="context">
    <SelectBox
            nodes={hook.nodes}
            selected={hook.selected}
            targetElementID={internalID}
            setSelected={hook.setSelected}
    />
    <svg
            id={internalID}
            on:dragover={e => e.preventDefault()}
            on:contextmenu={e => e.preventDefault()}

            data-board={"BOARD"}
            style={{
                        transformOrigin: "center center",
                        height: BOARD_SIZE + "px",
                        width: BOARD_SIZE + "px",
                    }}

            on:drop={event => {
                        event.preventDefault()
                        const nodes = handleDropBoard(event.dataTransfer.getData("text"), getAllNodes)
                        if (nodes)
                            handleDropNode(nodes, event, ref, hook)

                    }}
            bind:this={ref}
            class="wrapper"
            on:mousedown={e => {
                if (e.button === 2)
                    handleBoardScroll(ref.current.parentNode)
                if (e.target === ref.current)
                    hook.setSelected([])
            }}
    >
        {#each hook.nodes as node}
            {#if node.isComment}
                <Comment
                        onDrag={{setDragType: v => dragType = v, dragType}}
                        setSelected={(i) => hook.setSelected([i])}
                        submitName={newName => {
                                    hook.setNodes(prev => {
                                        return prev.map(p => {
                                            if (p.id === node.id)
                                                p.name = newName

                                            return p
                                        })
                                    })
                                }}
                        selected={hook.selected}
                        node={node}
                />
            {/if}
        {/each}
        {#each links as l}
            <path
                    data-link={l.target + "-" + l.source}
                    fill={"none"}
                    stroke={"#fff"}
                    stroke-width={LINK_WIDTH}
                    id={l.target + "-" + l.source}
                    d=""
            />
        {/each}
        {#each hook.nodes.map as node}
            {#if !node.isComment }
                <Node
                        onDrag={{setDragType: v => dragType = v, dragType}}
                        links={links}
                        submitBundledVariable={(key, value) => {

                                    hook.setNodes(prev => {
                                        return prev.map(p => {
                                            if (p.id === node.id)
                                                p[key] = value
                                            return p
                                        })
                                    })
                                }}
                        setSelected={(i, multi) => {
                                    if (multi)
                                        setSelected(i)
                                    else
                                        hook.setSelected([i])
                                }}
                        selected={hook.selected}
                        node={node}
                        handleLink={}/>
            {/if}
        {/each}
    </svg>
</div>
