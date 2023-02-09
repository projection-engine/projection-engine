<script>
    import {onDestroy, onMount} from "svelte";
    import GIZMOS from "../../../static/GIZMOS.ts";
    import LOCALIZATION_EN from "../../../../../static/objects/LOCALIZATION_EN";
    import GizmoSystem from "../../../../../engine-tools/runtime/GizmoSystem";

    const TO_DEG = 180 / Math.PI
    export let settings
    export let selectedSize

    let translationRef
    let rotationRef
    let scaleRef

    onMount(() => {
        GizmoSystem.translationRef = translationRef
        GizmoSystem.rotationRef = rotationRef
        GizmoSystem.scaleRef = scaleRef
    })

    onDestroy(() => {
        GizmoSystem.translationRef = GizmoSystem.rotationRef = GizmoSystem.scaleRef = undefined
    })

    $: isValidPivot = settings.gizmo === GIZMOS.TRANSLATION && selectedSize === 1
    $: isValidScaling = settings.gizmo === GIZMOS.SCALE
</script>

<div class="left-content">
    <div data-svelteinline="-" style={settings.gizmo !== GIZMOS.TRANSLATION ? "display: none" : undefined }>
        <strong>{LOCALIZATION_EN.TRANSLATION}</strong>
        <small bind:this={translationRef}></small>
    </div>

    <div data-svelteinline="-" style={settings.gizmo !== GIZMOS.SCALE ? "display: none" : undefined }>
        <strong>{LOCALIZATION_EN.SCALE}</strong>
        <small bind:this={scaleRef}></small>
    </div>

    <div data-svelteinline="-" style={settings.gizmo !== GIZMOS.ROTATION ? "display: none" : undefined }>
        <strong>{LOCALIZATION_EN.ROTATION}</strong>
        <small bind:this={rotationRef}></small>
    </div>
</div>
<div class="right-content">
    {#if isValidScaling}
        <div class="row">ALT - {LOCALIZATION_EN.ALT_FOR_FIXED}</div>
    {/if}
    {#if isValidPivot}
        <div class="row">ALT - {LOCALIZATION_EN.ALT_FOR_PIVOT}</div>
    {/if}
    <div class="row">CTRL - {LOCALIZATION_EN.CTRL_FOR_UNITARY}</div>
</div>


<style>
    small {
        color: var(--pj-color-quaternary);
        font-size: .7rem;
    }

    .left-content {
        width: 100%;
        font-size: .7rem;
        display: flex;
        gap: 4px;
        align-items: center;
        justify-content: flex-start;
    }

    .right-content {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 4px;
    }

    .row {
        padding: 4px;
        border-radius: 3px;
        font-size: .7rem;
        z-index: 999;
        height: 25px;
    }
</style>