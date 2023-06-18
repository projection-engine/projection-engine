<script>
    import RENDER_TARGET from "../../static/RENDER_TARGET"
    import {onDestroy, onMount} from "svelte"
    import updateRenderer from "./utils/update-renderer"
    import EngineStore from "../../../shared/stores/EngineStore"
    import SettingsStore from "../../../shared/stores/SettingsStore"
    import SelectionStore from "../../../shared/stores/SelectionStore"
    import FSAssetService from "../../services/file-system/FSAssetService"
    import VisualsStore from "../../../shared/stores/VisualsStore"
    import Engine from "../../../../engine-core/Engine"
    import EngineTools from "../../../../engine-core/tools/EngineTools"
    import LevelService from "../../services/engine/LevelService"
    import UIAPI from "../../../../engine-core/lib/rendering/UIAPI"
    import GPU from "../../../../engine-core/GPU"

    export let initializeEditor

    let canvasRef
    let done = false
    let engine = {}
    let settings = {}
    let visuals = {}
    let selected = []
    const unsubscribeSelection = SelectionStore.getStore(() => selected = SelectionStore.engineSelected)
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    const unsubscribeVisuals = VisualsStore.getStore(v => visuals = v)

    onMount(() => {
    	Engine.initializeContext(
    		canvasRef,
    		{w: visuals.resolutionX, h: visuals.resolutionY},
    		FSAssetService.readAsset,
    		true
    	).then(async () => {
    		done = true
    		await EngineTools.initialize().catch()
    		const toLoad = LevelService.getInstance().getLevelToLoad()
    		await LevelService.getInstance().loadLevel(toLoad).catch()

    		initializeEditor()
    		UIAPI.buildUI(GPU.canvas.parentElement)
    		UIAPI.hideUI()


    	})
    })

    onDestroy(() => {
    	unsubscribeVisuals()
    	unsubscribeSelection()

    	unsubscribeEngine()
    	unsubscribeSettings()
    })
    $: {
    	if (engine.executingAnimation)
    		UIAPI.showUI()
    }
    $: if (done) updateRenderer(selected, engine, {...settings, ...visuals})
</script>


<div id={RENDER_TARGET} class="stretch">
    <canvas
            class="stretch"
            data-svelteviewport="-"
            bind:this={canvasRef}
            width={visuals.resolutionX}
            height={visuals.resolutionY}
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