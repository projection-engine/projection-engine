<script>
    import FileSystemUtil from "../../../shared/FileSystemUtil"
    import {onDestroy, onMount} from "svelte"
    import ShaderEditorTools from "./libs/ShaderEditorTools"
    import materialCompiler from "./libs/material-compiler/material-compiler"
    import HeaderOptions from "./components/HeaderOptions.svelte"
    import Icon from "../../../shared/components/icon/Icon.svelte"
    import ElectronResources from "../../../shared/lib/ElectronResources"
    import Canvas from "./libs/Canvas"
    import getShaderActions from "../../templates/get-shader-actions"
    import HotKeysController from "../../../shared/lib/HotKeysController"
    import ContextMenuService from "../../../shared/lib/context-menu/ContextMenuService"
    import SideBar from "./components/SideBar.svelte"
    import NODE_MAP from "./static/NODE_MAP"
    import LocalizationEN from "../../../../../shared/enums/LocalizationEN"
    import ShaderEditorUtil from "../../util/ShaderEditorUtil"
    import SerializedState from "../../components/view/SerializedState.svelte";

    const COMPONENT_ID = crypto.randomUUID()

    const canvas = new Canvas()
    let openFile
    let ref
    let canvasElement

    onMount(() => {
    	canvas.initialize(canvasElement)
    	const data = getShaderActions(canvas)
    	ContextMenuService.getInstance().mount(data.contextMenu, COMPONENT_ID)
    	if (canvas.ctx?.canvas)
    		HotKeysController.bindAction(
    			canvas.ctx.canvas,
    			data.hotkeys,
    			"texture",
    			LocalizationEN.SHADER_EDITOR
    		)
    })

    onDestroy(() => {
    	ContextMenuService.getInstance().destroy(COMPONENT_ID)
    	if (canvas.ctx?.canvas)
    		HotKeysController.unbindAction(canvas.ctx.canvas)
    })

    async function initializeStructure() {
    	canvas.openFile = openFile
    	canvas.clearState()

    	await ShaderEditorUtil.parseFile(openFile, canvas)
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

    const openSourceCode = async () => {
    	const [{shader}] = await materialCompiler(canvas.nodes, canvas.links)
    	const newFile = FileSystemUtil.TEMP + FileSystemUtil.sep + openFile.registryID + ".log"
    	await FileSystemUtil.writeFile(newFile, shader, true)
    	ElectronResources.shell.openPath(newFile).catch(console.error)
    }
</script>

<SerializedState
        state={{
    			openFile,
    			comments: canvas.comments,
    			selection: Array.from(canvas.selectionMap.keys()),
    			nodes: canvas.nodes,
    			links: canvas.links
    		}}
        onStateInitialize={state => {
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
        }}
/>
<HeaderOptions

        openFile={openFile}
        initializeFromFile={initializeFromFile}
        canvasAPI={canvas}
        openSourceCode={openSourceCode}
/>
<div class="wrapper" bind:this={ref} id={COMPONENT_ID}>
    <canvas on:dragover={e => e.preventDefault()} class="canvas"
            bind:this={canvasElement}></canvas>
</div>
{#if !openFile?.registryID}
    <div data-svelteempty="-">
        <Icon styles="font-size: 75px">texture</Icon>
        {LocalizationEN.NO_MATERIAL_SELECTED}
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
