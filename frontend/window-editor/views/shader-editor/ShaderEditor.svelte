<script>
    import FilesAPI from "../../lib/fs/FilesAPI"
    import LOCALIZATION_EN from "../../../../static/objects/LOCALIZATION_EN";
    import EngineStore from "../../../shared/stores/EngineStore";
    import {onDestroy, onMount} from "svelte";
    import parseFile from "./utils/parse-file";
    import ShaderEditorTools from "./libs/ShaderEditorTools";
    import ViewStateController from "../../components/view/libs/ViewStateController";
    import materialCompiler from "./libs/material-compiler/material-compiler";
    import HeaderOptions from "./components/HeaderOptions.svelte";
    import Icon from "../../../shared/components/icon/Icon.svelte";
    import FS from "../../../shared/lib/FS/FS";
    import ElectronResources from "../../../shared/lib/ElectronResources";
    import Canvas from "./libs/Canvas";
    import shaderActions from "../../templates/shader-actions";
    import HotKeysController from "../../../shared/lib/HotKeysController";
    import ContextMenuController from "../../../shared/lib/context-menu/ContextMenuController";
    import SideBar from "./components/SideBar.svelte";
    import NODE_MAP from "./static/NODE_MAP";

    export let viewID
    export let viewIndex
    export let groupIndex

    let engine

    const canvas = new Canvas( )
    const internalID = crypto.randomUUID()
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)

    let openFile
    let ref

    let wasInitialized = false
    let canvasElement

    onMount(() => {
        canvas.initialize(canvasElement)
        const data = shaderActions(canvas)
        ContextMenuController.mount(
            data.contextMenu,
            internalID
        )
        if (canvas.ctx?.canvas)
            HotKeysController.bindAction(
                canvas.ctx.canvas,
                data.hotkeys,
                "texture",
                LOCALIZATION_EN.SHADER_EDITOR
            )
    })

    onDestroy(() => {
        unsubscribeEngine()
        ContextMenuController.destroy(internalID)
        if (canvas.ctx?.canvas)
            HotKeysController.unbindAction(canvas.ctx.canvas)
    })

    async function initializeStructure() {
        canvas.openFile = openFile
        canvas.clearState()

        await parseFile(openFile, canvas)
        canvas.addNode(new NODE_MAP.Material(), true)
    }

    function initializeFromFile(v) {
        canvas.clearState()
        openFile = v
        canvas.openFile = v

        if (!v)
            return
        initializeStructure()
    }

    $: {
        if (wasInitialized) {
            const newState = {
                openFile,
                comments: canvas.comments,
                selection: Array.from(canvas.selectionMap.keys()),
                nodes: canvas.nodes,
                links: canvas.links
            }
            ViewStateController.updateState(viewID, viewIndex, groupIndex, newState)
        } else {
            const state = ViewStateController.getState(viewID, viewIndex, groupIndex)
            const newFile = ShaderEditorTools.toOpenFile || state?.openFile

            initializeFromFile(newFile)
            ShaderEditorTools.toOpenFile = undefined
            if (state != null && newFile) {
                canvas.clearState()
                state.nodes.forEach(n => canvas.addNode(n, true, true))
                state.links.forEach(n => canvas.addLink(n, true))
                state.comments.forEach(n => canvas.addComment(n, true, true))

                state.selection.forEach(k => {
                    const found = canvas.nodes.find(n => n.id === k) || canvas.comments.find(n => n.id === k)
                    canvas.selectionMap.set(k, found)
                })
                canvas.clear()
            }
            wasInitialized = true
        }
    }


</script>

<HeaderOptions

        openFile={openFile}
        initializeFromFile={initializeFromFile}
        canvasAPI={canvas}
        openSourceCode={async () => {
            const [{shader}] = await materialCompiler(canvas.nodes, canvas.links)
            const newFile = FS.TEMP + FS.sep + openFile.registryID + ".log"
            await FilesAPI.writeFile(newFile, shader, true)
            ElectronResources.shell.openPath(newFile).catch()
        }}
/>
<div class="wrapper" bind:this={ref} id={internalID}>
    <canvas  on:dragover={e => e.preventDefault()} class="canvas"
            bind:this={canvasElement}></canvas>
</div>
{#if !openFile?.registryID}
    <div data-svelteempty="-">
        <Icon styles="font-size: 75px">texture</Icon>
        {LOCALIZATION_EN.NO_MATERIAL_SELECTED}
    </div>
{:else}
    <SideBar canvasAPI={canvas}/>
{/if}

<style>

    .canvas {
        color-rendering: optimizespeed;
        background: var(--pj-background-quaternary) radial-gradient(var(--pj-border-primary) 1px, transparent 0);
        background-size: 20px 20px;
    }

    .wrapper {
        height: 100%;
        width: 100%;
        overflow: hidden;
        position: relative;
    }
</style>