<script>
    import buildShader from "./utils/build-shader"
    import Nodes from "./components/Nodes.svelte"
    import selection from "./utils/selection"
    import SELECTION_TYPES from "./static/SELECT_ACTIONS"
    import FilesAPI from "../../lib/fs/FilesAPI"

    import LOCALIZATION_EN from "../../templates/LOCALIZATION_EN";
    import EngineStore from "../../stores/EngineStore";
    import {onDestroy} from "svelte";
    import parseFile from "./utils/parse-file";
    import Material from "./libs/nodes/Material";
    import BOARD_SIZE from "./static/BOARD_SIZE";
    import ViewHeader from "../../components/view/components/ViewHeader.svelte";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import SelectionStore from "../../stores/SelectionStore";
    import ShaderEditorTools from "./libs/ShaderEditorTools";
    import Selector from "../../components/selector/Selector.svelte";
    import ViewStateController from "../../components/view/libs/ViewStateController";
    import materialCompiler from "../../lib/engine-tools/lib/material-compiler/material-compiler";
    import NodeFS from "shared-resources/frontend/libs/NodeFS";
    import SEContextController from "./libs/SEContextController";
    import ShaderCanvas from "./components/ShaderCanvas.svelte";
    import onMutation from "./utils/on-mutation";

    const {shell} = window.require("electron")

    export let viewID
    export let viewIndex
    export let groupIndex

    let openFile
    let nodes = []
    let links = []
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
                    v => {
                        nodes = v
                        onMutation(openFile.registryID)
                    },
                    v => {
                        links = v
                        onMutation(openFile.registryID)
                    },
                    () => nodes,
                    () => links)
                isReady = true
            },
            v => links = v
        ).catch()
    }

    function initializeFromFile(v) {
        if (!v) {
            SEContextController.deleteContext(openFile?.registryID)
            openFile = v
        } else if (SEContextController.getContext(v.registryID))
            alert.pushAlert(LOCALIZATION_EN.FILE_ALREADY_OPEN)
        else {
            isReady = false
            openFile = v
            initializeStructure()
        }
    }

    $: invalidFile = !openFile
    $: {
        if (wasInitialized) {
            const newState = {openFile, nodes, links}
            ViewStateController.updateState(viewID, viewIndex, groupIndex, newState)
        } else {
            const state = ViewStateController.getState(viewID, viewIndex, groupIndex)
            const newFile = ShaderEditorTools.toOpenFile || state?.openFile
            if (!newFile)
                SEContextController.deleteContext(openFile?.registryID)
            initializeFromFile(newFile)
            if (newFile?.registryID)
                initializeStructure()
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
        SEContextController.deleteContext(openFile?.registryID)
    })
</script>

<ViewHeader>
    <div data-inline="-" style="width: 100%">
        <button
                disabled={invalidFile}
                class="button"
                on:click={() => {
                    buildShader(nodes, links, openFile, v => status = v).then(() => {
                        ShaderEditorTools.save(openFile, nodes, links).catch(err => console.error(err))
                    })
                }}>
            <Icon styles="font-size: .9rem">save</Icon>
            {LOCALIZATION_EN.SAVE}
        </button>
        <button
                disabled={invalidFile}
                class="button"
                on:click={() => buildShader(nodes, links, openFile, v => status = v).catch()}
        >
            <Icon styles="font-size: .9rem">code</Icon>
            {LOCALIZATION_EN.COMPILE}
        </button>
        <div data-vertdivider="-"></div>
        <Selector
                styles="max-width: 20vw;"
                mergeMaterials={false}
                size="small"
                type="material"
                noDefault="true"
                handleChange={initializeFromFile}
                selected={openFile}
        />

        {#if !invalidFile}
            <Nodes/>
        {/if}
    </div>

    <div data-inline="-" style="width: 100%; justify-content: flex-end">
        <Dropdown>
            <button class="button" slot="button">
                {LOCALIZATION_EN.SELECT}
            </button>

            <button on:click={ () => selection(SELECTION_TYPES.ALL, nodes )}>
                {LOCALIZATION_EN.ALL}
            </button>

            <button on:click={ () => selection(SELECTION_TYPES.NONE, nodes )}>
                {LOCALIZATION_EN.NONE}
            </button>

            <button on:click={ () => selection(SELECTION_TYPES.INVERT, nodes )}>
                {LOCALIZATION_EN.INVERT}
            </button>
        </Dropdown>
        <button
                class="button"
                data-highlight="-"
                on:click={e => {
                    if (ShaderEditorTools.grid === ShaderEditorTools.GRID_SIZE) {
                        ShaderEditorTools.grid = 1
                        e.currentTarget.setAttribute("data-highlight", "")

                    } else {
                        ShaderEditorTools.grid = ShaderEditorTools.GRID_SIZE
                        e.currentTarget.setAttribute("data-highlight", "-")

                    }
                }}
        >
            <Icon styles="font-size: .9rem">grid_4x4</Icon>
            <ToolTip content={LOCALIZATION_EN.TOGGLE_GRID}/>
        </button>
        {#if !invalidFile}
            <button
                    class="button"
                    on:click={async () => {
                        const {shader} = await materialCompiler(nodes, links)
                        const newFile = NodeFS.temp + NodeFS.sep + openFile.registryID + ".log"
                        await FilesAPI.writeFile(newFile, shader, true)
                        shell.openPath(newFile).catch()
                    }}
            >
                <Icon styles="font-size: .9rem">code</Icon>
                <ToolTip content={LOCALIZATION_EN.SOURCE}/>
            </button>
        {/if}
    </div>
</ViewHeader>
<div class="wrapper" bind:this={ref}>
    {#if !invalidFile}
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
    .wrapper {
        display: flex;
        height: 100%;
        width: 100%;
        overflow: hidden;
    }

    .button {
        display: flex;
        align-items: center;
        gap: 4px;
        height: 23px;
        border: none;
    }


</style>