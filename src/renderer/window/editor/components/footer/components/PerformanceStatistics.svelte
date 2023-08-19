<script>
    import {onDestroy, onMount} from "svelte"
    import EngineState from "@engine-core/states/EngineState";
    import PerformanceMetricsSystem from "../PerformanceMetricsSystem";
    import SystemManager from "@engine-core/managers/SystemManager";

    const COMPONENT_ID = crypto.randomUUID()
    const MEMORY_UPDATE_INTERVAL = 2000
    let frameTime
    let frameRate
    let memory
    onMount(() => {
        let startMemoryCheck = MEMORY_UPDATE_INTERVAL + 1
        PerformanceMetricsSystem.get().execute = () => {
            const el = EngineState.elapsed
            frameRate.textContent = Math.round(1000 / el) + "FPS"
            frameTime.textContent = el.toFixed(2) + "ms"
            if (startMemoryCheck > MEMORY_UPDATE_INTERVAL) {
                const data = window.performance.memory.usedJSHeapSize / 1e+6
                memory.textContent = data.toFixed(2) + "mb"
                startMemoryCheck = 0
            }
            startMemoryCheck += el
        }
        SystemManager.getInstance().enableSystem(PerformanceMetricsSystem)
    })
    onDestroy(() => {
        PerformanceMetricsSystem.get().execute = undefined
        SystemManager.getInstance().disableSystem(PerformanceMetricsSystem)
    })
</script>

<div class="wrapper footer-header">
    <small bind:this={frameRate}></small>
    <div data-sveltevertdivider="-"></div>
    <small bind:this={frameTime}></small>
    <div data-sveltevertdivider="-"></div>
    <small bind:this={memory}></small>
</div>
