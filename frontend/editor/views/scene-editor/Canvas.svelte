<script>
    import RENDER_TARGET from "../../static/RENDER_TARGET"
    import {onMount} from "svelte"
    import EngineToolsService from "../../services/EngineToolsService"
    import FSAssetUtil from "../../services/file-system/FSAssetUtil"
    import VisualsStore from "../../../shared/stores/VisualsStore"
    import Engine from "../../../../engine-core/Engine"
    import EngineTools from "../../../../engine-core/tools/EngineTools"
    import LevelService from "../../services/engine/LevelService"
    import UIAPI from "../../../../engine-core/lib/rendering/UIAPI"
    import GPU from "../../../../engine-core/GPU"

    export let initializeEditor

    let canvasRef

    onMount(() => {
    	Engine.initializeContext(
    		canvasRef,
    		{w: VisualsStore.data.resolutionX, h:  VisualsStore.data.resolutionY},
    		FSAssetUtil.readAsset,
    		true
    	).then(async () => {
    		const levelServiceInstance = LevelService.getInstance()
    		await EngineTools.initialize().catch()
    		const toLoad = levelServiceInstance.getLevelToLoad()
    		await levelServiceInstance.loadLevel(toLoad).catch()

    		initializeEditor()
    		UIAPI.buildUI(GPU.canvas.parentElement)
    		UIAPI.hideUI()
    		EngineToolsService.get()
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