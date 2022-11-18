<script>

    import Comment from "./node/Comment.svelte";
    import SelectBox from "../../../components/select-box/SelectBox.svelte";
    import handleBoardScroll from "../utils/handle-board-scroll";
    import handleDropNode from "../utils/handle-drop-node";
    import handleDropBoard from "../utils/handle-drop-board";
    import BOARD_SIZE from "../static/BOARD_SIZE";
    import {onDestroy, onMount} from "svelte";
    import Node from "./node/Node.svelte";
    import onMutation from "../utils/on-mutation";
    import handleLink from "../utils/handle-link";
    import ShaderEditorTools from "../libs/ShaderEditorTools";
    import SelectionStore from "../../../stores/SelectionStore";
    import ContextMenuController from "shared-resources/frontend/libs/ContextMenuController";
    import Localization from "../../../templates/LOCALIZATION_EN";
    import shaderActions from "../../../templates/shader-actions";
    import HotKeysController from "../../../lib/utils/HotKeysController";
    import Link from "./Link.svelte";
    import SEContextController from "../libs/SEContextController";

    const EMPTY_MAP = new Map()
    export let openFile

    let ctx
    let links = []
    let nodes = []
    let selected = []

    let timeout
    let ref
    let mutationObserver
    let selectionMap
    const unsubscribe = SelectionStore.getStore(() => {
        selected = SelectionStore.shaderEditorSelected
        selectionMap = SelectionStore.data.TARGET === SelectionStore.TYPES.SHADER_EDITOR ? SelectionStore.map : EMPTY_MAP
    })

    const handleWheel = (e) => {
        e.preventDefault()
        let s = ShaderEditorTools.scale
        if (e.wheelDelta > 0 && s < 3)
            s += s * .1
        else if (e.wheelDelta < 0 && s >= .5)
            s -= s * .1

        ref.style.transform = "scale(" + s + ")"
        ShaderEditorTools.scale = s
    }

    function updateData() {
        nodes = ctx.getNodes()
        links = ctx.getLinks()
    }

    onMount(() => {
        console.trace("ON MOUNT", openFile.registryID)
        ctx = SEContextController.getContext(openFile.registryID)
        SEContextController.initializeCallback(openFile.registryID, updateData)
        updateData()

        const {contextMenu, hotkeys} = shaderActions(openFile)
        HotKeysController.unbindAction(ref)
        ContextMenuController.destroy(openFile.registryID)
        ContextMenuController.mount(
            {icon: "texture", label: Localization.SHADER_EDITOR},
            contextMenu,
            openFile.registryID,
            [],
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
                        SelectionStore.shaderEditorSelected = [links.find(l => l.identifier === id)]
                        break
                    }
                    if (id) {
                        SelectionStore.shaderEditorSelected = [nodes.find(n => n.id === id)]
                        break
                    }
                }

            }
        )
        HotKeysController.bindAction(
            ref,
            hotkeys,
            "texture",
            Localization.SHADER_EDITOR
        )

        ref.parentElement.scrollTop = BOARD_SIZE / 2
        ref.parentElement.scrollLeft = BOARD_SIZE / 2
        ref.parentElement.addEventListener("wheel", handleWheel, {passive: false})

        mutationObserver = new MutationObserver(e => onMutation(openFile.registryID, e))
        mutationObserver.observe(ref, {subtree: true, childList: true, attributes: true})

        timeout = setTimeout(() => onMutation(openFile.registryID), 250)
    })


    onDestroy(() => {
        unsubscribe()
        clearTimeout(timeout)
        HotKeysController.unbindAction(ref)
        ContextMenuController.destroy(openFile.registryID)
        ref.parentElement.removeEventListener("wheel", handleWheel, {passive: false})
        mutationObserver.disconnect()
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
            selected={selected}
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