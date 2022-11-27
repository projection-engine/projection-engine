<script>
    import {onDestroy, onMount} from "svelte";
    import BufferVisualization from "../../../lib/engine-tools/runtime/BufferVisualization";
    import ResizableBar from "shared-resources/frontend/components/resizable/ResizableBar.svelte"
    import ConversionAPI from "../../../../public/engine/lib/math/ConversionAPI";
    import BufferItem from "./BufferItem.svelte";

    let ref
    let resizeObs
    let buffers = []
    let heightScale = 1
    let widthScale = 1
    let offset = 0
    export let settings

    function handler(e) {
        if (Math.sign(e.wheelDelta) > 0 && BufferVisualization.bufferOffset === 0)
            return
        BufferVisualization.bufferOffset -= Math.sign(e.wheelDelta)
        offset = BufferVisualization.bufferOffset
    }

    onMount(() => {
        resizeObs = new ResizeObserver(() => {
            const bbox = document.body.getBoundingClientRect()
            heightScale = bbox.height / ConversionAPI.canvasBBox.height
            widthScale = bbox.width / ConversionAPI.canvasBBox.width
            BufferVisualization.updateDimensions(ref.offsetHeight * heightScale)
        })
        resizeObs.observe(ref)
        ref.addEventListener("wheel", handler, {passive: false})
        buffers = BufferVisualization.buffers
    })
    onDestroy(() => {
        ref.removeEventListener("wheel", handler)
        resizeObs.disconnect()
    })

</script>
<div
        class="wrapper"
        style={`
            bottom: ${8/heightScale}px;
            left: ${8/widthScale}px;
        `}
>
    {#if settings.visibleBuffers}
        <div style="max-height: 0"></div>
        <ResizableBar type="height"/>
    {/if}
    <div
            class="buffer-views"
            bind:this={ref}
            style={settings.visibleBuffers ? `gap: ${8/widthScale}px` : "display: none;"}>
        {#each buffers as _, i}
            {#if buffers[i + offset]}
                <BufferItem buffer={buffers[i + offset]} widthScale={widthScale}/>
            {/if}
        {/each}
    </div>
</div>

<style>


    .wrapper {
        position: absolute;

        width: calc(100% - 8px);
        height: fit-content;
        overflow: hidden;
        display: grid;
        gap: 4px;
        z-index: 10;
    }

    .buffer-views {
        height: clamp(250px, 15vh, 750px);
        display: flex;
        gap: 8px;
        width: 100%;
    }
</style>