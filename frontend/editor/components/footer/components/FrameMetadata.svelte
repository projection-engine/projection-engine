<script>
    import {onDestroy, onMount} from "svelte"
    import Renderer from "../../../../../engine-core/Renderer"

    export let settings

    let fr
    let ft
    let interval
    let mem
    onMount(() => {

    	const cb = () => {
    		const el = Renderer.elapsed
    		fr.textContent = Math.round(1000 / el) + "FPS"
    		ft.textContent = el.toFixed(2) + "ms"
    		requestAnimationFrame(cb)
    	}
    	requestAnimationFrame(cb)

    	const updateMem = () => {
    		const data = window.performance.memory.usedJSHeapSize / 1e+6
    		mem.textContent = data.toFixed(2) + "mb"
    	}

    	updateMem()
    	interval = setInterval(updateMem, 2500)
    })
    onDestroy(() => clearInterval(interval))
</script>

<div class="wrapper footer-header">
    <small bind:this={fr}></small>
    <div data-sveltevertdivider="-"></div>
    <small bind:this={ft}></small>
    <div data-sveltevertdivider="-"></div>
    <small bind:this={mem}></small>
</div>
