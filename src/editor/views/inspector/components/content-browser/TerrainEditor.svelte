<script>
    import {onDestroy, onMount} from "svelte";
    import DrawingAPI from "../../../../../../public/engine/editor/libs/DrawingAPI";
    import TerrainWorker from "../../../../../../public/engine/production/workers/terrain/TerrainWorker";
    import {GPU} from "../../../../../../public/engine/production";

    export let data
    export let update
    export let id

    let canvas
    let resizeOBS
    let api

    let brushSize
    let brushIntensity
    let falloff

    function updateCanvas() {
        const bBox = canvas.getBoundingClientRect()
        canvas.style.height = bBox.width + "px"
        canvas.width = bBox.width
        canvas.height = bBox.height
    }

    onMount(() => {
        updateCanvas()
        let promise
        api = new DrawingAPI(
            canvas,
            data.image,
            () => {
                if (promise)
                    return
                promise = update(canvas.toDataURL())
                console.log(promise)
                promise.then(() => promise = undefined)
            }
        )

        resizeOBS = new ResizeObserver(() => updateCanvas())
    })
    onDestroy(() => api.destroy())
</script>

<div class="wrapper">
    <canvas
            bind:this={canvas}
            width={500}
            height={500}
    ></canvas>
</div>

<style>
    canvas {
        width: 100%;
        height: 100%;
    }

    .wrapper {
        overflow: hidden;
        width: 100%;
        background: var(--pj-background-secondary);
        padding: 4px;
        border-radius: 3px;
    }
</style>