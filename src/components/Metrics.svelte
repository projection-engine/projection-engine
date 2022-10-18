<script>
    import ResizableBar from "shared-resources/frontend/components/resizable/ResizableBar.svelte"
    import {onDestroy, onMount} from "svelte";
    import {Engine} from "../../public/engine/production";
    import Localization from "../libs/Localization";

    let fr
    let ft
    let interval
    let mem
    let rendering
    let scripting
    let singleLoop
    let simulation
    const translate = key => Localization.PROJECT.INFO[key]

    onMount(() => {
        const m = Engine.metrics
        const cb = () => {
            if (!fr)
                return
            fr.textContent = Math.round(m.frameRate) + "FPS"
            ft.textContent = m.frameTime.toFixed(2) + "ms"
            rendering.textContent = m.rendering.toFixed(2) + "ms"
            scripting.textContent = m.scripting.toFixed(2) + "ms"
            simulation.textContent = m.simulation.toFixed(2) + "ms"
            singleLoop.textContent = (
                m.rendering +
                m.scripting +
                m.simulation
            ).toFixed(2) + "ms"

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
<div class="wrapper">
    <div style="max-width: 10px"></div>
    <ResizableBar type="width"/>
    <div class="content">
        <div class="section">
            <small>{translate("LOOP_FRAME_TIME")}</small>
            <strong bind:this={singleLoop}></strong>
        </div>
        <div class="section">
            <small>{translate("EXECUTION_FRAME_RATE")}</small>
            <strong bind:this={fr}></strong>
        </div>
        <div class="section">
            <small>{translate("EXECUTION_FRAME_TIME")}</small>
            <strong bind:this={ft}></strong>
        </div>
        <div class="section">
            <small>{translate("MEMORY")}</small>
            <strong bind:this={mem}></strong>
        </div>
        <div data-divider="-"></div>
        <div class="section">
            <small>{translate("RENDERING")}</small>
            <strong bind:this={rendering}></strong>
        </div>
        <div class="section">
            <small>{translate("SIMULATION")}</small>
            <strong bind:this={simulation}></strong>
        </div>
        <div class="section">
            <small>{translate("SCRIPTING")}</small>
            <strong bind:this={scripting}></strong>
        </div>
    </div>
</div>

<style>
    strong {
        font-size: .8rem;
        font-weight: 500;
    }

    .wrapper {
        display: flex;
        overflow: hidden;
        position: absolute;
        right: 4px;
        bottom: 4px;
        z-index: 10;
    }

    .section {
        display: grid;
        gap: 2px;
        padding: 2px 0;
    }

    .content {
        display: flex;
        flex-direction: column;

        padding: 8px;
        min-width: 150px;
        min-height: 250px;

        border-radius: 3px;
        backdrop-filter: blur(2px) brightness(90%);
    }
</style>