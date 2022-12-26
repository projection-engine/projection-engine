<script>
    import buildShader from "./utils/build-shader"
    import FilesAPI from "../../lib/fs/FilesAPI"

    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import EngineStore from "../../stores/EngineStore";
    import {onDestroy} from "svelte";
    import parseFile from "./utils/parse-file";
    import Material from "./libs/nodes/Material";
    import BOARD_SIZE from "./static/BOARD_SIZE";
    import ViewHeader from "../../../components/view/components/ViewHeader.svelte";
    import SelectionStore from "../../stores/SelectionStore";
    import ShaderEditorTools from "./libs/ShaderEditorTools";
    import ViewStateController from "../../../components/view/libs/ViewStateController";
    import materialCompiler from "./libs/material-compiler/material-compiler";
    import SEContextController from "./libs/SEContextController";
    import ShaderCanvas from "./components/ShaderCanvas.svelte";
    import HeaderOptions from "./components/HeaderOptions.svelte";
    import UndoRedoAPI from "../../lib/utils/UndoRedoAPI";
    import Icon from "../../../components/icon/Icon.svelte";
    import NodeFS from "../../../lib/FS/NodeFS";
    import AlertController from "../../../components/alert/AlertController";

    const {shell} = window.require("electron")

    export let viewID
    export let viewIndex
    export let groupIndex

    let openFile
    let nodes = []
    let links = []
    let dragWillStart
    let status
    let ref
    let engine
    let wasInitialized = false
    let isReady = false

    const unsubscribeEngine = EngineStore.getStore(v => engine = v)

    function initializeStructure() {
        SEContextController.deleteContext(openFile?.registryID)
        status = {}
        SelectionStore.shaderEditorSelected = []

        parseFile(
            openFile,
            (d) => {
                const found = d.find(dd => dd instanceof Material)
                if (found)
                    nodes = d
                else {
                    const newMat = new Material()
                    newMat.x = newMat.x + BOARD_SIZE / 2
                    newMat.y = newMat.y + BOARD_SIZE / 2
                    nodes = [...d, newMat]
                }
                SEContextController.registerContext(
                    openFile.registryID,
                    v => nodes = v.map(n => {
                        n.CONTEXT_ID = openFile.registryID
                        return n
                    }),
                    v => links = v,
                    () => nodes,
                    () => links,
                    v => dragWillStart = v
                )
                isReady = true
            },
            v => links = v
        ).catch()
    }

    function initializeFromFile(v) {
        if (!v) {
            UndoRedoAPI.clearShaderEditorStates()
            SEContextController.deleteContext(openFile?.registryID)
            openFile = v
        } else if (SEContextController.getContext(v.registryID))
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
            const newState = {openFile, nodes, links}
            ViewStateController.updateState(viewID, viewIndex, groupIndex, newState)
        } else {
            const state = ViewStateController.getState(viewID, viewIndex, groupIndex)
            const newFile = ShaderEditorTools.toOpenFile || state?.openFile

            initializeFromFile(newFile)
            ShaderEditorTools.toOpenFile = undefined
            if (state != null) {
                nodes = state.nodes
                links = state.links
                status = state.status
            }
            wasInitialized = true
        }
    }

    onDestroy(() => {
        unsubscribeEngine()
        UndoRedoAPI.clearShaderEditorStates()
        SEContextController.deleteContext(openFile?.registryID)
    })
</script>

<ViewHeader>
    <small style={dragWillStart && !openFile?.registryID ? undefined : "display: none"} id={openFile?.registryID + "-T"}></small>
    {#if !dragWillStart || !openFile?.registryID}
        <HeaderOptions
                save={() => {
                    buildShader(nodes, links, openFile, v => status = v).then(() => {
                        ShaderEditorTools.save(openFile, nodes, links).catch(err => console.error(err))
                    })
                }}
                openFile={openFile}
                compile={() => buildShader(nodes, links, openFile, v => status = v).catch()}
                initializeFromFile={initializeFromFile}
                nodes={nodes}
                openSourceCode={async () => {
                    const {shader} = await materialCompiler(nodes, links)
                    const newFile = NodeFS.temp + NodeFS.sep + openFile.registryID + ".log"
                    await FilesAPI.writeFile(newFile, shader, true)
                    shell.openPath(newFile).catch()
                }}
        />
    {/if}
</ViewHeader>
<div class="wrapper" bind:this={ref}>
    {#if openFile?.registryID}
        {#if isReady}
            {#key openFile}
                <ShaderCanvas openFile={openFile}/>
            {/key}
        {:else}
            <div data-empty="-">
                <Icon styles="font-size: 75px">texture</Icon>
                {LOCALIZATION_EN.LOADING_MATERIAL}
            </div>
        {/if}
    {:else}
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

    .wrapper {
        display: flex;
        height: 100%;
        width: 100%;
        overflow: hidden;
    }
</style>