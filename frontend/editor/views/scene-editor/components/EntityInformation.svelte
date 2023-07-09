<script>
    import {onDestroy, onMount} from "svelte"
    import GIZMOS from "../../../../../shared/enums/Gizmos.ts"

    import GizmoSystem from "../../../../../engine-core/tools/gizmo/GizmoSystem"
    import LocalizationEN from "../../../../../shared/enums/LocalizationEN"
    import SettingsStore from "../../../../stores/SettingsStore"
    import SelectionStore from "../../../../stores/SelectionStore"
    import SelectionStoreUtil from "../../../util/SelectionStoreUtil"

    const COMPONENT_ID = crypto.randomUUID()

    let selectedSize
    let translationRef
    let rotationRef
    let scaleRef
    let gizmo
    let isValidPivot = false
    let isValidScaling = false

    onMount(() => {
    	SelectionStore.getInstance().addListener(COMPONENT_ID, () => selectedSize = SelectionStoreUtil.getEntitiesSelected().length)
    	SettingsStore.getInstance().addListener(COMPONENT_ID, data => {
    		gizmo = data.gizmo
    		isValidPivot = gizmo === GIZMOS.TRANSLATION && selectedSize === 1
    		isValidScaling = gizmo === GIZMOS.SCALE
    	}, ["gizmo"])
    	GizmoSystem.translationRef = translationRef
    	GizmoSystem.rotationRef = rotationRef
    	GizmoSystem.scaleRef = scaleRef
    })

    onDestroy(() => {
    	SelectionStore.getInstance().removeListener(COMPONENT_ID)
    	SettingsStore.getInstance().removeListener(COMPONENT_ID)
    	GizmoSystem.translationRef = GizmoSystem.rotationRef = GizmoSystem.scaleRef = undefined
    })
</script>

<div class="left-content">
    <div data-svelteinline="-" style={gizmo !== GIZMOS.TRANSLATION ? "display: none" : undefined }>
        <strong>{LocalizationEN.TRANSLATION}</strong>
        <small bind:this={translationRef}></small>
    </div>

    <div data-svelteinline="-" style={gizmo !== GIZMOS.SCALE ? "display: none" : undefined }>
        <strong>{LocalizationEN.SCALE}</strong>
        <small bind:this={scaleRef}></small>
    </div>

    <div data-svelteinline="-" style={gizmo !== GIZMOS.ROTATION ? "display: none" : undefined }>
        <strong>{LocalizationEN.ROTATION}</strong>
        <small bind:this={rotationRef}></small>
    </div>
</div>
<div class="right-content">
    {#if isValidScaling}
        <div class="row">ALT - {LocalizationEN.ALT_FOR_FIXED}</div>
    {/if}
    {#if isValidPivot}
        <div class="row">ALT - {LocalizationEN.ALT_FOR_PIVOT}</div>
    {/if}
    <div class="row">CTRL - {LocalizationEN.CTRL_FOR_UNITARY}</div>
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