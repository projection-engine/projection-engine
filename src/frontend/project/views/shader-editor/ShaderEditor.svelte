<script>
    import buildShader from "./libs/build-shader"
    import Nodes from "./components/Nodes.svelte"
    import selection from "./utils/selection"
    import SELECTION_TYPES from "./templates/SELECT_ACTIONS"
    import FilesAPI from "../../../libs/files/FilesAPI"
    import compiler from "./libs/compiler"
    import Localization from "../../../libs/Localization";
    import EngineStore from "../../stores/EngineStore";
    import {onDestroy} from "svelte";
    import parseFile from "./libs/parse-file";
    import Material from "./templates/nodes/Material";
    import BOARD_SIZE from "./data/BOARD_SIZE";
    import Header from "../../../components/view/components/Header.svelte";
    import ToolTip from "../../../components/tooltip/ToolTip.svelte";
    import Icon from "../../../components/icon/Icon.svelte";
    import Dropdown from "../../../components/dropdown/Dropdown.svelte";
    import Editor from "./components/Editor.svelte";
    import SelectionStore from "../../stores/SelectionStore";
    import ShaderEditorController from "./ShaderEditorController";
    import HotKeys from "../../components/metrics/libs/HotKeys";
    import getShortcuts from "./utils/get-shortcuts";
    import Selector from "../../../components/selector/Selector.svelte";
    import ViewStateController from "../../../components/view/ViewStateController";

    export let hidden
    export let switchView
    export let orientation
    export let viewID
    export let viewIndex

    const {shell} = window.require("electron")
    const translate = key => Localization.PROJECT.SHADER_EDITOR[key]


    let openFile = {}
    let nodes = []
    let links = []
    let status

    let ref
    let selected = []
    let selectedEntity
    let engine
    let needsInitialization = false
    let wasInitialized = false
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribe = SelectionStore.getStore(() => {
        selected = SelectionStore.shaderEditorSelected
        selectedEntity = SelectionStore.selectedEntity
    })

    $: {
        if (wasInitialized) {
            const newState = {
                openFile,
                nodes,
                links,
                status,
            }
            ViewStateController.updateState(viewID, viewIndex, newState)
        } else {
            const state = ViewStateController.getState(viewID, viewIndex)
            if (state != null) {
                openFile = state.openFile
                nodes = state.nodes
                links = state.links
                status = state.status
                needsInitialization = false
            }
            wasInitialized = true
        }
    }
    $: {
        if (ref)
            HotKeys.bindAction(
                ref,
                getShortcuts(openFile, nodes, v => nodes = v, links, v => links = v),
                "texture",
                Localization.PROJECT.SHADER_EDITOR.TITLE
            )
    }
    onDestroy(() => {
        HotKeys.unbindAction(ref)
        unsubscribe()
        unsubscribeEngine()
    })

    $: {
        if(needsInitialization) {
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
                },
                v => links = v
            ).catch()
            needsInitialization = false
        }
    }
</script>
<Header
        orientation={orientation}
        hidden={hidden}
        switchView={switchView}
        title={translate("TITLE")}
        icon={"texture"}
>
    <div class="options">
        <div class="divider"></div>
        <button
                disabled={!openFile?.registryID}
                class="button"
                on:click={() => {
                    buildShader(nodes, links, openFile, v => status = v, translate).then(() => {
                        ShaderEditorController.save(openFile, nodes, links).catch(err => console.error(err))
                    })
                }}>
            <Icon styles="font-size: .9rem">save</Icon>
            {translate("SAVE")}
        </button>
        <button
                disabled={!openFile?.registryID}
                class="button"
                on:click={() => buildShader(nodes, links, openFile, v => status = v, translate).catch()}
        >
            <Icon styles="font-size: .9rem">code</Icon>
            {translate("COMPILE")}
        </button>
        <div class="divider"></div>
        <Selector
                size="small"
                type="material"
                noDefault="true"
                handleChange={v => {
                    openFile = v
                    needsInitialization = true
                }}
                selected={openFile}
        />

        {#if openFile.registryID}
            <Nodes translate={translate}/>
        {/if}
    </div>
    <div class="options" style="justify-content: flex-end">
        <Dropdown>
            <button class="button" slot="button">
                {translate("SELECT")}
            </button>

            <button on:click={ () => selection(SELECTION_TYPES.ALL, nodes )}>
                {translate("ALL")}
            </button>

            <button on:click={ () => selection(SELECTION_TYPES.NONE, nodes )}>
                {translate("NONE")}
            </button>

            <button on:click={ () => selection(SELECTION_TYPES.INVERT, nodes )}>
                {translate("INVERT")}
            </button>
        </Dropdown>

        <button
                class="button"
                data-highlight="-"
                on:click={e => {
                    if (ShaderEditorController.grid === ShaderEditorController.GRID_SIZE) {
                        ShaderEditorController.grid = 1
                        e.currentTarget.setAttribute("data-highlight", "")

                    } else {
                        ShaderEditorController.grid = ShaderEditorController.GRID_SIZE
                        e.currentTarget.setAttribute("data-highlight", "-")

                    }
                }}
        >
            <Icon styles="font-size: .9rem">grid_4x4</Icon>
            <ToolTip content={translate("GRID")}/>
        </button>
        <button
                class="button"
                disabled={!openFile.registryID}
                on:click={async () => {
                    const {shader} = await compiler(nodes, links)
                    const newFile = FilesAPI.temp + FilesAPI.sep + openFile.registryID + ".log"
                    await FilesAPI.writeFile(newFile, shader, true)
                    shell.openPath(newFile).catch()
                }}
        >
            <Icon styles="font-size: .9rem">code</Icon>
            <ToolTip content={translate("SOURCE")}/>
        </button>
    </div>
</Header>
<div style={hidden ? "display: none": undefined} class="wrapper" bind:this={ref}>
    <Editor
            translate={translate}
            isOpen={openFile.registryID !== undefined}
            selected={selected}
            nodes={nodes}
            setNodes={v => nodes = v}
            links={links}
            setLinks={v => links = v}
    />
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

    .options {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 6px;
        width: 100%;
        padding-left: 4px;
    }

    .divider {
        height: 20px;
        background: var(--pj-background-tertiary);
        width: 2px;

    }
</style>