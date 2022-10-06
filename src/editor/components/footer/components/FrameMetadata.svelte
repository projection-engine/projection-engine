<script>
    import {onDestroy, onMount} from "svelte";
    import {Engine} from "../../../../../public/engine/production";

    let fr
    let ft
    let interval
    let mem
    onMount(() => {
        const m = Engine.metrics
        const cb = () => {
            fr.textContent = Math.round(m.frameRate) + "FPS"
            ft.textContent = m.frameTime.toFixed(2) + "ms"
            requestAnimationFrame(cb)
        }
        requestAnimationFrame(cb)
        const updateMem = () => {
            console.time("START")
            const data = window.performance.memory.usedJSHeapSize / 1e+6
            mem.textContent = data.toFixed(2) + "mb"

        }

        updateMem()
        interval = setInterval(updateMem, 2500)
    })
    onDestroy(() => clearInterval(interval))
</script>


<small bind:this={fr}></small>
<div data-vertdivider="-"></div>
<small bind:this={ft}></small>
<div data-vertdivider="-"></div>
<small bind:this={mem}></small>

<style>
    small {
        font-size: .675rem;
    }
</style>