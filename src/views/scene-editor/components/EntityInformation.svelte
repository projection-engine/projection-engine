<script>
    import {onDestroy, onMount} from "svelte";
    import GIZMOS from "../../../data/GIZMOS";
    import SelectionStore from "../../../stores/SelectionStore";
    import Localization from "../../../templates/LOCALIZATION_EN";
    import Engine from "../../../../public/engine/Engine";

    export let settings
    export let engine

    let translationRef
    let rotationRef
    let scaleRef

    let selectedSize = -1
    let mainEntity
    let currentInterval
    const unsubscribeSelection = SelectionStore.getStore(_ => {
        selectedSize = SelectionStore.engineSelected.length
        mainEntity = Engine.entitiesMap.get(SelectionStore.engineSelected[0])
    })
    onDestroy(() => unsubscribeSelection())

    $: {
        clearInterval(currentInterval)
        if (translationRef && rotationRef && scaleRef) {
            if (mainEntity) {
                let initialized = false
                currentInterval = setInterval(() => {
                    console.log("ON INTERVAL")
                    if (mainEntity && (mainEntity.__changedBuffer[1] || !initialized)) {
                        initialized = true
                        translationRef.textContent = `X ${mainEntity._translation[1].toFixed(2)} | Y ${mainEntity._translation[1].toFixed(2)} | Z ${mainEntity._translation[2].toFixed(2)}`
                        rotationRef.textContent = `X ${mainEntity._rotationQuat[1].toFixed(2)} | Y ${mainEntity._rotationQuat[1].toFixed(2)} | Z ${mainEntity._rotationQuat[2].toFixed(2)} | W ${mainEntity._rotationQuat[3].toFixed(2)}`
                        scaleRef.textContent = `X ${mainEntity._scaling[1].toFixed(2)} | Y ${mainEntity._scaling[1].toFixed(2)} | Z ${mainEntity._scaling[2].toFixed(2)}`
                    }
                }, 250)
            }
        }
    }
    $: isValidPivot = settings.gizmo === GIZMOS.TRANSLATION && selectedSize === 1
    $: isValidScaling = settings.gizmo === GIZMOS.SCALE
</script>

<div class="wrapper" style={!mainEntity ? "display: none" : undefined}>
    <div class="left-content">
        <div data-inline="-">
            <strong>{Localization.TRANSLATION}</strong>
            <div bind:this={translationRef}></div>
        </div>
        <div data-vertdivider="-"></div>
        <div data-inline="-">
            <strong>{Localization.SCALE}</strong>
            <div bind:this={scaleRef}></div>
        </div>
        <div data-vertdivider="-"></div>
        <div data-inline="-">
            <strong>{Localization.ROTATION}</strong>
            <div bind:this={rotationRef}></div>
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
</div>

<style>
    .wrapper {
        position: absolute;
        bottom: 0;
        left: 0;

        display: flex;
        align-items: center;

        background: rgba(41, 41, 41, .5);
        width: 100%;
        height: 25px;
        z-index: 10;
    }

    .left-content {
        width: 100%;
        font-size: .7rem;
        display: flex;
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