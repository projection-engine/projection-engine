<script>
    import LOCALIZATION_EN from "../../../templates/LOCALIZATION_EN";
    import {onMount} from "svelte";

    export let widthScale
    export let buffer

    let formatKey
    onMount(() => {
        const map = {
            [gpu.RGBA32F]: "RGBA32F",
            [gpu.RGBA16F]: "RGBA16F",
            [gpu.RGBA]: "RGBA",
            [gpu.RGBA8]: "RGBA8",
            [gpu.RGB32F]: "RGB32F",
            [gpu.RGB16F]: "RGB16F",
            [gpu.RGB8]: "RGB8",
            [gpu.RGB]: "RGB",
            [gpu.RG32F]: "RG32F",
            [gpu.RG16F]: "RG16F",
            [gpu.RG]: "RG",
            [gpu.RG8]: "RG8",
            [gpu.R32F]: "R32F",
            [gpu.R16F]: "R16F",
            [gpu.R8]: "R8",
            [gpu.RED]: "RED",
        }

        if (buffer.precision !== undefined)
            formatKey = map[buffer.precision]
    })
</script>

<div class="buffer" style={`width: ${350/widthScale}px`}>
    <strong style="width: 100%">{LOCALIZATION_EN[buffer.framebufferKey] || LOCALIZATION_EN.UNKNOWN}
        - {buffer.isDepthSampler ? LOCALIZATION_EN.DEPTH_SAMPLER : buffer.index}</strong>
    <div class="buffer-metadata">
        {#if buffer.isDepthSampler}
            <strong>{LOCALIZATION_EN.TEXTURE_FORMAT} - {LOCALIZATION_EN.DEPTH_SAMPLER}</strong>
            <strong>{LOCALIZATION_EN.RESOLUTION} - {buffer.width}x{buffer.height}</strong>
        {:else}
            <strong>{LOCALIZATION_EN.TEXTURE_FORMAT} - {formatKey}</strong>
            <strong>{LOCALIZATION_EN.TEXTURE_FILTERING}
                - {buffer.linear ? LOCALIZATION_EN.LINEAR : LOCALIZATION_EN.NEAREST}</strong>
            <strong>{LOCALIZATION_EN.TEXTURE_WRAPPING}
                - {buffer.repeat ? LOCALIZATION_EN.REPEAT : LOCALIZATION_EN.CLAMP_TO_EDGE}</strong>
            <strong>{LOCALIZATION_EN.RESOLUTION} - {buffer.w}x{buffer.h}</strong>
        {/if}
    </div>
</div>


<style>
    .buffer {
        font-size: .8rem;
        display: flex;
        flex-direction: column;
        padding: 8px;
        height: 100%;
    }

    .buffer:hover {
        backdrop-filter: blur(10px) brightness(95%);
    }

    .buffer:hover > .buffer-metadata {
        visibility: visible;
    }


    .buffer-metadata {
        display: grid;
        height: 100%;
        visibility: hidden;
        align-content: center;
        gap: 2px;
    }
</style>