<script>
    import buildShader from "./libs/material-compiler/build-shader"
    import FilesAPI from "../../lib/fs/FilesAPI"

    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import EngineStore from "../../stores/EngineStore";
    import {onDestroy, onMount} from "svelte";
    import parseFile from "./utils/parse-file";
    import ViewHeader from "../../../components/view/components/ViewHeader.svelte";
    import SelectionStore from "../../stores/SelectionStore";
    import ShaderEditorTools from "./libs/ShaderEditorTools";
    import ViewStateController from "../../../components/view/libs/ViewStateController";
    import materialCompiler from "./libs/material-compiler/material-compiler";


    import HeaderOptions from "./components/HeaderOptions.svelte";
    import UndoRedoAPI from "../../lib/utils/UndoRedoAPI";
    import Icon from "../../../components/icon/Icon.svelte";
    import NodeFS from "../../../lib/FS/NodeFS";
    import AlertController from "../../../components/alert/AlertController";
    import Canvas from "./libs/Canvas";

    const {shell} = window.require("electron")

    export let viewID
    export let viewIndex
    export let groupIndex

    const canvas = new Canvas()
    let openFile
    let dragWillStart
    let ref
    let engine
    let wasInitialized = false
    let isReady = false
    let canvasElement

    onMount(() => {
        canvas.initialize(canvasElement)
    })
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)

    async function initializeStructure() {
        canvas.selectionMap.clear()
        canvas.lastSelection = undefined
        canvas.openFile = openFile

        SelectionStore.shaderEditorSelected = []

        await parseFile(openFile, canvas)
        canvas.clear()
        isReady = true
    }

    function initializeFromFile(v) {
        if (!v) {
            UndoRedoAPI.clearShaderEditorStates()
            openFile = v
        } else if (canvas.openFile)
            AlertController.warn(LOCALIZATION_EN.FILE_ALREADY_OPEN)
        else {
            UndoRedoAPI.clearShaderEditorStates()
            isReady = false
            openFile = v
            initializeStructure()
        }
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
            if (state != null) {
                canvas.nodes.push(...state.nodes)
                canvas.links.push(...state.links)
                canvas.comments.push(...state.comments)
                state.selection.forEach(k => {
                    const found = canvas.nodes.find(n => n.id === k) || canvas.comments.find(n => n.id === k)
                    canvas.selectionMap.set(k, found)
                })
                canvas.clear()
            }
            wasInitialized = true
        }
    }

    onDestroy(() => {
        unsubscribeEngine()
        UndoRedoAPI.clearShaderEditorStates()
    })
</script>

<ViewHeader>
    <small style={dragWillStart && !openFile?.registryID ? undefined : "display: none"}
           id={openFile?.registryID + "-T"}></small>
    {#if !openFile?.registryID}
        <HeaderOptions
                save={async () => {
                    await buildShader(canvas, openFile)
                    await ShaderEditorTools.save(openFile, canvas)
                }}
                openFile={openFile}
                compile={() => buildShader(canvas, openFile).catch()}
                initializeFromFile={initializeFromFile}
                canvasAPI={canvas}
                openSourceCode={async () => {
                    const {shader} = await materialCompiler(canvas.nodes, canvas.links)
                    const newFile = NodeFS.temp + NodeFS.sep + openFile.registryID + ".log"
                    await FilesAPI.writeFile(newFile, shader, true)
                    shell.openPath(newFile).catch()
                }}
        />
    {/if}
</ViewHeader>
<div class="wrapper" bind:this={ref}>
    <canvas class="canvas" bind:this={canvasElement}></canvas>
    {#if !openFile?.registryID}
        <div data-empty="-">
            <Icon styles="font-size: 75px">texture</Icon>
            {LOCALIZATION_EN.NO_MATERIAL_SELECTED}
        </div>
    {/if}
</div>

<style>
    small {
        font-size: .7rem;
    }
    .canvas{
        left: 0;
        top: 0;
        z-index: 0;
        position: relative;
        box-shadow: var(--pj-boxshadow);
        color-rendering: optimizespeed;
        background: var(--pj-background-quaternary) radial-gradient(var(--pj-border-primary) 1px, transparent 0);
        background-size: 20px 20px;
    }
    .wrapper {
        z-index: 0;
        position: relative;
        height: 100%;
        width: 100%;
        overflow: hidden;
    }
</style>