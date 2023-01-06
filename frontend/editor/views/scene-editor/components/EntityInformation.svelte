<script>
    import {onDestroy, onMount} from "svelte";
    import GIZMOS from "../../../static/GIZMOS.ts";
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import GizmoSystem from "../../../../../engine-tools/runtime/GizmoSystem";
    import {quat} from "gl-matrix";
    import RotationGizmo from "../../../../../engine-tools/lib/transformation/RotationGizmo";

    const TO_DEG = 180 / Math.PI
    export let settings
    export let engine
    export let selectedSize
    export let mainEntity

    let translationRef
    let rotationRef
    let scaleRef
    let currentEntity
    function update() {
        if (!mainEntity || !translationRef || !rotationRef || !scaleRef)
            return
        if (settings.gizmo === GIZMOS.TRANSLATION)
            translationRef.textContent = `X ${mainEntity._translation[0].toFixed(2)} | Y ${mainEntity._translation[1].toFixed(2)} | Z ${mainEntity._translation[2].toFixed(2)}`
        if (settings.gizmo === GIZMOS.ROTATION) {
            const Q = mainEntity._rotationQuat, R = mainEntity.__rotationCache, GR = RotationGizmo.currentRotation
            const EX = ((R[0] + GR[0]) * TO_DEG).toFixed(2),
                EY = ((R[1] + GR[1]) * TO_DEG).toFixed(2),
                EZ = ((R[2] + GR[2]) * TO_DEG).toFixed(2)
            rotationRef.textContent = `Quaternion: X ${Q[0].toFixed(2)} | Y ${Q[1].toFixed(2)} | Z ${Q[2].toFixed(2)} | W ${Q[3].toFixed(2)} (Euler: X ${EX} | Y ${EY} | Z ${EZ})`
        }
        if (settings.gizmo === GIZMOS.SCALE)
            scaleRef.textContent = `X ${mainEntity._scaling[0].toFixed(2)} | Y ${mainEntity._scaling[1].toFixed(2)} | Z ${mainEntity._scaling[2].toFixed(2)}`
    }

    onMount(() => {
        GizmoSystem.updateGizmoToolTip = () => update()
    })
    $: {
        if (mainEntity && mainEntity !== currentEntity) {
            currentEntity = mainEntity
            mainEntity.__rotationCache = [
                quat.getAxisAngle([1, 0, 0], mainEntity._rotationQuat),
                quat.getAxisAngle([0, 1, 0], mainEntity._rotationQuat),
                quat.getAxisAngle([0, 0, 1], mainEntity._rotationQuat)
            ]
            update()
        }
    }

    onDestroy(() => GizmoSystem.updateGizmoToolTip = () => null)
    $: isValidPivot = settings.gizmo === GIZMOS.TRANSLATION && selectedSize === 1
    $: isValidScaling = settings.gizmo === GIZMOS.SCALE
</script>


<div class="left-content">
    <div data-inline="-" style={settings.gizmo !== GIZMOS.TRANSLATION ? "display: none" : undefined }>
        <strong>{LOCALIZATION_EN.TRANSLATION}</strong>
        <small bind:this={translationRef}></small>
    </div>

    <div data-inline="-" style={settings.gizmo !== GIZMOS.SCALE ? "display: none" : undefined }>
        <strong>{LOCALIZATION_EN.SCALE}</strong>
        <small bind:this={scaleRef}></small>
    </div>

    <div data-inline="-" style={settings.gizmo !== GIZMOS.ROTATION ? "display: none" : undefined }>
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