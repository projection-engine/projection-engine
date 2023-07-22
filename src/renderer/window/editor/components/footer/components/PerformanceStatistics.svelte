<script>
    import {onDestroy, onMount} from "svelte"
    import Renderer from "../../../../../engine/core/Renderer"
    import Engine from "../../../../../engine/core/Engine"

    const COMPONENT_ID = crypto.randomUUID()
    const MEMORY_UPDATE_INTERVAL = 2000
    let frameTime
    let frameRate
    let memory
    onMount(() => {
    	let startMemoryCheck = MEMORY_UPDATE_INTERVAL + 1
    	Engine.addSystem(COMPONENT_ID, () => {
    		const el = Renderer.elapsed
    		frameRate.textContent = Math.round(1000 / el) + "FPS"
    		frameTime.textContent = el.toFixed(2) + "ms"
    		if(startMemoryCheck > MEMORY_UPDATE_INTERVAL) {
    			const data = window.performance.memory.usedJSHeapSize / 1e+6
    			memory.textContent = data.toFixed(2) + "mb"
    			startMemoryCheck = 0
    		}
    		startMemoryCheck += el
    	})
    })
    onDestroy(() => Engine.removeSystem(COMPONENT_ID))
</script>

<div class="wrapper footer-header">
    <small bind:this={frameRate}></small>
    <div data-sveltevertdivider="-"></div>
    <small bind:this={frameTime}></small>
    <div data-sveltevertdivider="-"></div>
    <small bind:this={memory}></small>
</div>
