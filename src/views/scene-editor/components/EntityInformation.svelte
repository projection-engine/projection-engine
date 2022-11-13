<script>
    import {onDestroy} from "svelte";
    import GIZMOS from "../../../static/GIZMOS";
    import SelectionStore from "../../../stores/SelectionStore";
    import Localization from "../../../templates/LOCALIZATION_EN";
    import Engine from "../../../../public/engine/Engine";
    import RotationGizmo from "../../../lib/engine-tools/lib/transformation/RotationGizmo";
    import GizmoSystem from "../../../lib/engine-tools/runtime/GizmoSystem";
    import TranslationGizmo from "../../../lib/engine-tools/lib/transformation/TranslationGizmo";
    import ScalingGizmo from "../../../lib/engine-tools/lib/transformation/ScalingGizmo";

    export let settings
    export let engine
    export let selectedSize
    export let mainEntity
    let translationRef
    let rotationRef
    let scaleRef


    let currentInterval


    $: {
        clearInterval(currentInterval)
        if (translationRef && rotationRef && scaleRef) {
                currentInterval = setInterval(() => {
                    console.log("ON INTERVAL")
                    if (!translationRef || !rotationRef || !scaleRef) {
                        clearInterval(currentInterval)
                        return
                    }
                    if (mainEntity) {

                        if (GizmoSystem.targetGizmo instanceof TranslationGizmo) {
                            translationRef.textContent = `X ${mainEntity._translation[0].toFixed(2)} | Y ${mainEntity._translation[1].toFixed(2)} | Z ${mainEntity._translation[2].toFixed(2)}`
                            translationRef.parentElement.style.display = "flex"
                        } else
                            translationRef.parentElement.style.display = "none"
                        if (GizmoSystem.targetGizmo instanceof RotationGizmo) {
                            rotationRef.textContent = `X ${mainEntity._rotationQuat[0].toFixed(2)} | Y ${mainEntity._rotationQuat[1].toFixed(2)} | Z ${mainEntity._rotationQuat[2].toFixed(2)} | W ${mainEntity._rotationQuat[3].toFixed(2)}`
                            rotationRef.parentElement.style.display = "flex"
                        } else
                            rotationRef.parentElement.style.display = "none"

                        if (GizmoSystem.targetGizmo instanceof ScalingGizmo) {
                            scaleRef.textContent = `X ${mainEntity._scaling[0].toFixed(2)} | Y ${mainEntity._scaling[1].toFixed(2)} | Z ${mainEntity._scaling[2].toFixed(2)}`
                            scaleRef.parentElement.style.display = "flex"
                        } else
                            scaleRef.parentElement.style.display = "none"
                    }
                }, 250)
        }
    }
    onDestroy(() => clearInterval(currentInterval))
    $: isValidPivot = settings.gizmo === GIZMOS.TRANSLATION && selectedSize === 1
    $: isValidScaling = settings.gizmo === GIZMOS.SCALE
</script>


<div class="left-content">
    <div data-inline="-">
        <strong>{Localization.TRANSLATION}</strong>
        <small bind:this={translationRef}></small>
    </div>

    <div data-inline="-">
        <strong>{Localization.SCALE}</strong>
        <small bind:this={scaleRef}></small>
    </div>

    <div data-inline="-">
        <strong>{Localization.ROTATION}</strong>
        <small bind:this={rotationRef}></small>
    </div>
</div>
<div class="right-content">
    {#if isValidScaling}
        <div class="row">ALT - {Localization.ALT_FOR_FIXED}</div>
    {/if}
    {#if isValidPivot}
        <div class="row">ALT - {Localization.ALT_FOR_PIVOT}</div>
    {/if}
    <div class="row">CTRL - {Localization.CTRL_FOR_UNITARY}</div>
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