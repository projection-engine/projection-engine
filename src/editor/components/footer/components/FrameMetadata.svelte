<script>
    import {onMount} from "svelte";
    import {Engine} from "../../../../../public/engine/production";

    let fr
    let ft
    onMount(() => {
        const m = Engine.metrics
        const cb = () => {
            fr.textContent = Math.round(m.frameRate) + "FPS"
            ft.textContent = m.frameTime.toFixed(2) + "ms"
            requestAnimationFrame(cb)
        }
        requestAnimationFrame(cb)
    })
</script>


<small bind:this={fr}></small>
<div data-vertdivider="-"></div>
<small bind:this={ft}></small>

<style>
    small {
        font-size: .675rem;
    }
</style>