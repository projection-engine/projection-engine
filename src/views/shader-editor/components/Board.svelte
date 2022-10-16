<script>

    import Comment from "./node/Comment.svelte";
    import SelectBox from "../../../components/select-box/SelectBox.svelte";
    import handleBoardScroll from "../utils/handle-board-scroll";
    import handleDropNode from "../utils/handle-drop-node";
    import handleDropBoard from "../utils/handle-drop-board";
    import BOARD_SIZE from "../data/BOARD_SIZE";
    import {onDestroy, onMount} from "svelte";
    import Node from "./node/Node.svelte";
    import resolveLinks from "../utils/resolve-links";
    import onMutation from "../libs/on-mutation";
    import handleLink from "../utils/handle-link";
    import ShaderEditorController from "../ShaderEditorController";
    import SelectionStore from "../../../stores/SelectionStore";
    import ContextMenuController from "shared-resources/frontend/libs/ContextMenuController";
    import Localization from "../../../libs/Localization";
    import shaderActions from "../../../templates/shader-actions";
    import HotKeysController from "../../../libs/HotKeysController";
    import SettingsStore from "../../../stores/SettingsStore";
    import Link from "./Link.svelte";

    export let links
    export let setLinks
    export let nodes
    export let setNodes
    export let selected
    export let submitNodeVariable
    export let isOpen
    export let openFile
    export let internalID
    const TRIGGERS = [
        "data-node",
        "data-board",
        "data-link",
        "data-group"
    ]

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

    let ref

    $: resolvedLinks = resolveLinks(links)
    let settings
    const unsubscribe = SettingsStore.getStore(v => settings = v)

    $: {
        if (ref) {
            const {contextMenu, hotkeys} = shaderActions(
                settings,
                openFile,
                nodes,
                setNodes,
                links,
                setLinks,
                ref.parentElement
            )
            HotKeysController.unbindAction(ref)
            ContextMenuController.destroy(internalID)
            ContextMenuController.mount(
                {icon: "texture", label: Localization.PROJECT.SHADER_EDITOR.TITLE},
                contextMenu,
                internalID,
                TRIGGERS,
                (trigger, element, event) => {
                    const el = event.path || []
                    for (let i = 0; i < el.length; i++) {
                        const current = el[i]
                        if (current === document.body)
                            break
                        if (!current)
                            continue
                        const id = current.getAttribute("data-id")
                        const link = current.getAttribute("data-link")
                        if (link) {
                            SelectionStore.shaderEditorSelected = [link]
                            break
                        }
                        if (id) {
                            SelectionStore.shaderEditorSelected = [id]
                            break
                        }
                    }

                }
            )
            HotKeysController.bindAction(
                ref,
                hotkeys,
                "texture",
                Localization.PROJECT.SHADER_EDITOR.TITLE
            )
        }
    }
    onMount(() => {
        ref.parentElement.scrollTop = BOARD_SIZE / 2
        ref.parentElement.scrollLeft = BOARD_SIZE / 2
        ref.parentElement.addEventListener("wheel", handleWheel, {passive: false})
        mutationObserver.observe(ref, {subtree: true, childList: true, attributes: true})
    })

    onDestroy(() => {
        unsubscribe()
        HotKeysController.unbindAction(ref)
        ContextMenuController.destroy(internalID)
        if (ref && ref.parentElement)
            ref.parentElement.removeEventListener("wheel", handleWheel, {passive: false})
        mutationObserver.disconnect()
    })
    let timeout
    $: {
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
            style="position: relative; height: {BOARD_SIZE}px;width: {BOARD_SIZE}px"
            on:drop={event => {
               event.preventDefault()
                if(!isOpen)
                    return
                const foundNodes = handleDropBoard(event.dataTransfer.getData("text"))
                if (!foundNodes)
                    return
                handleDropNode(foundNodes, event, ref, nodes, setNodes)

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
                <Link data={l} selected={selected} setSelected={setSelected}/>
            {/each}
            {#each nodes as node}
                {#if !node.isComment }
                    <Node
                            internalID={internalID}
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