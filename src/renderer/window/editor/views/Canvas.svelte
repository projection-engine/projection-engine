<script lang="ts">
    import RENDER_TARGET from "../static/RENDER_TARGET"
    import {onMount} from "svelte"
    import EngineToolsService from "../services/EngineToolsService"
    import VisualsStore from "../../shared/stores/VisualsStore"
    import Engine from "../../../engine/core/Engine"
    import EngineTools from "../../../engine/tools/EngineTools"
    import EditorLevelService from "../services/engine/EditorLevelService"
    import UIManager from "@engine-core/managers/UIManager"
    import GPUState from "@engine-core/states/GPUState"
    import EditorFSUtil from "../util/EditorFSUtil"

    export let initializeEditor

    let canvasRef

    onMount(() => {
    	Engine.initializeContext(
    		canvasRef,
    		{w: VisualsStore.getData().resolutionX, h:  VisualsStore.getData().resolutionY},
    		id => EditorFSUtil.readAsset<string>(id),
    		true
    	).then(async () => {
    		const levelServiceInstance = EditorLevelService.getInstance()
    		await EngineTools.initialize().catch(console.error)
    		const toLoad = levelServiceInstance.getLevelToLoad()
    		await levelServiceInstance.loadLevel(toLoad).catch(console.error)

    		initializeEditor()
    		UIManager.buildUI(GPUState.canvas.parentElement)
    		UIManager.hideUI()
    		EngineToolsService.get()
            Engine.start()
    	})
    })

</script>


<div id={RENDER_TARGET} class="stretch">
    <canvas
            class="stretch"
            data-svelteviewport="-"
            bind:this={canvasRef}
    ></canvas>
</div>

<style>

    .stretch {
        width: 100%;
        height: 100%;
        background: transparent;
        position: relative;
        overflow: hidden;
    }
</style>
