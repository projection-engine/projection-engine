<script>
    import {onDestroy, onMount} from "svelte";
    import GIZMOS from "../../../static/GIZMOS";
    import Localization from "../../../templates/LOCALIZATION_EN";
    import GizmoSystem from "../../../lib/engine-tools/runtime/GizmoSystem";

    export let settings
    export let engine
    export let selectedSize
    export let mainEntity
    let translationRef
    let rotationRef
    let scaleRef

    function update(mainEntity){
        if (!mainEntity)
            return
        if (settings.gizmo === GIZMOS.TRANSLATION)
            translationRef.textContent = `X ${mainEntity._translation[0].toFixed(2)} | Y ${mainEntity._translation[1].toFixed(2)} | Z ${mainEntity._translation[2].toFixed(2)}`
        if (settings.gizmo === GIZMOS.ROTATION)
            rotationRef.textContent = `X ${mainEntity._rotationQuat[0].toFixed(2)} | Y ${mainEntity._rotationQuat[1].toFixed(2)} | Z ${mainEntity._rotationQuat[2].toFixed(2)} | W ${mainEntity._rotationQuat[3].toFixed(2)}`
        if (settings.gizmo === GIZMOS.SCALE)
            scaleRef.textContent = `X ${mainEntity._scaling[0].toFixed(2)} | Y ${mainEntity._scaling[1].toFixed(2)} | Z ${mainEntity._scaling[2].toFixed(2)}`
    }
    onMount(() => {
        GizmoSystem.updateGizmoToolTip = () => update(GizmoSystem.mainEntity)
    })
    $: {
        if(mainEntity && translationRef && rotationRef && scaleRef)
            update(mainEntity)
    }
    onDestroy(() => GizmoSystem.updateGizmoToolTip = () => null)
    $: isValidPivot = settings.gizmo === GIZMOS.TRANSLATION && selectedSize === 1
    $: isValidScaling = settings.gizmo === GIZMOS.SCALE
</script>


<div class="left-content">
    <div data-inline="-" style={settings.gizmo !== GIZMOS.TRANSLATION ? "display: none" : undefined }>
        <strong>{Localization.TRANSLATION}</strong>
        <small bind:this={translationRef}></small>
    </div>

    <div data-inline="-" style={settings.gizmo !== GIZMOS.SCALE ? "display: none" : undefined }>
        <strong>{Localization.SCALE}</strong>
        <small bind:this={scaleRef}></small>
    </div>

    <div data-inline="-" style={settings.gizmo !== GIZMOS.ROTATION ? "display: none" : undefined }>
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