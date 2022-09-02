<script>
    import buildShader from "./libs/build-shader"
    import Nodes from "./components/Nodes.svelte"
    import selection from "./utils/selection"
    import SELECTION_TYPES from "./templates/SELECT_ACTIONS"
    import FilesAPI from "../../../../libs/files/FilesAPI"
    import compiler from "./libs/compiler"
    import Localization from "../../../../libs/Localization";
    import EngineStore from "../../stores/EngineStore";
    import {onDestroy} from "svelte";
    import {v4} from "uuid";
    import FilesStore from "../../stores/FilesStore";
    import parseFile from "./libs/parse-file";
    import Material from "./templates/nodes/Material";
    import BOARD_SIZE from "./data/BOARD_SIZE";
    import COMPONENTS from "../../libs/engine/production/data/COMPONENTS";
    import Header from "../../../../components/view/components/Header.svelte";
    import ToolTip from "../../../../components/tooltip/ToolTip.svelte";
    import Icon from "../../../../components/icon/Icon.svelte";
    import Dropdown from "../../../../components/dropdown/Dropdown.svelte";
    import Editor from "./components/Editor.svelte";
    import SelectionStore from "../../stores/SelectionStore";

    export let hidden
    export let switchView
    export let orientation

    const GRID_SIZE = 20
    const {shell} = window.require("electron")
    const translate = key => Localization.PROJECT.SHADER_EDITOR[key]

    let engine
    let fileStore
    const unsubscribeFiles = FilesStore.getStore(v => fileStore = v)
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    onDestroy(() => {
        unsubscribeEngine()
        unsubscribeFiles()
    })

    const internalID = v4()
    let openFile = {}
    let nodes = []
    let links = []
    let status

    let selected = []
    const unsubscribe = SelectionStore.getStore(v => selected = v.array)

    function setSelected(data) {
        const old = {...SelectionStore.data, array: data}
        if (SelectionStore.TARGET !== SelectionStore.TYPES.SHADER_EDITOR)
            old.TARGET = SelectionStore.TYPES.SHADER_EDITOR
        SelectionStore.updateStore(old)
    }

    $: {
        if (engine.selectedEntity && engine.selectedEntity.components[COMPONENTS.MESH] && !openFile.registryID) {
            const mID = engine.selectedEntity.components[COMPONENTS.MESH].materialID
            const found = fileStore.materials.find(m => m.registryID === mID)
            if (found) {
                alert.pushAlert("Editing " + found.name, "info")
                openFile = found
            }
        }
    }

    $: {
        status = {}
        SelectionStore.updateStore([])
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
                on:click={() => window.shaderEditor.save(openFile, nodes, links, translate).catch()}>
            <Icon>save</Icon>
            {translate("SAVE")}
        </button>
        <button
                disabled={!openFile?.registryID}
                class="button"
                on:click={() => buildShader(nodes, links, openFile, v => status = v, translate).catch()}
        >
            <Icon>code</Icon>
            {translate("COMPILE")}
        </button>
        <div class="divider"></div>
        <Dropdown disabled={fileStore.materials.length === 0}>
            <button class="button" slot="button">
                <div class="icon"></div>
                {openFile.name ? openFile.name : ""}
            </button>


            {#each fileStore.materials as m, i}
                <button on:click={ () => openFile = m}>
                    {m.name}
                </button>
            {/each}
        </Dropdown>
        {#if openFile.registryID}
            <Nodes translate={translate}/>
        {/if}
    </div>
    <div class="options" style="justify-content: flex-end">
        <Dropdown>
            <button class="button" slot="button">
                {translate("SELECT")}
            </button>

            <button on:click={ () => selection(SELECTION_TYPES.ALL, nodes, setSelected, selected)}>
                {translate("ALL")}
            </button>

            <button on:click={ () => selection(SELECTION_TYPES.NONE, nodes, setSelected, selected)}>
                {translate("NONE")}
            </button>

            <button on:click={ () => selection(SELECTION_TYPES.INVERT, nodes, setSelected, selected)}>
                {translate("INVERT")}
            </button>
        </Dropdown>

        <button
                class="button"

                on:click={e => {
                if (window.shaderEditor.grid === GRID_SIZE) {
                    window.shaderEditor.grid = 1
                    e.currentTarget.setAttribute("data-highlight", "")

                } else {
                    window.shaderEditor.grid = GRID_SIZE
                    e.currentTarget.setAttribute("data-highlight", "-")

                }
            }}
        >
            <Icon>grid_4x4</Icon>
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
            <Icon>code</Icon>
            <ToolTip content={translate("SOURCE")}/>
        </button>
    </div>
</Header>
{#if !hidden}
    <Editor
            translate={translate}
            isOpen={openFile.registryID !== undefined}
            selected={selected}
            setSelected={setSelected}
            nodes={nodes}
            setNodes={v => nodes = v}
            links={links}
            setLinks={v => links = v}
    />
{/if}

<style>
    .icon {
        transition: 150ms linear;
        background: linear-gradient(to right bottom, white 25%, #333 75%);
        min-width: 13px;
        width: 13px;
        height: 13px;
        border-radius: 50%;
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