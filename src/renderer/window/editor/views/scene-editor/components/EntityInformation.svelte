<script>
    import {onDestroy, onMount} from "svelte"
    import GIZMOS from "../../../../../../shared/enums/Gizmos.ts"
    import Gizmos from "../../../../../../shared/enums/Gizmos.ts"

    import GizmoSystem from "../../../../../engine/tools/gizmo/GizmoSystem"
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"
    import SettingsStore from "../../../../shared/stores/SettingsStore"
    import EntitySelectionStore from "../../../../shared/stores/EntitySelectionStore"
    import GizmoState from "../../../../../engine/tools/gizmo/util/GizmoState"
    import SceneEditorUtil from "../../../util/SceneEditorUtil"

    /** @type boolean */
    export let isOnGizmo
    const COMPONENT_ID = crypto.randomUUID()

    let selectedSize
    let translationRef
    let rotationRef
    let scaleRef
    let gizmo
    let isValidPivot = false
    let isValidScaling = false

    onMount(() => {
    	GizmoSystem.addListener(COMPONENT_ID, () => {
    		const mainEntity = GizmoState.mainEntity
    		switch (GizmoState.gizmoType) {
    		case Gizmos.TRANSLATION: {
    			translationRef.textContent = `X ${mainEntity.translation[0].toFixed(2)} | Y ${mainEntity.translation[1].toFixed(2)} | Z ${mainEntity.translation[2].toFixed(2)}`
    			break
    		}
    		case Gizmos.ROTATION: {
    			const {roll, pitch, yaw} = SceneEditorUtil.quaternionToEulerAngles(mainEntity.rotationQuaternion)
    			rotationRef.textContent = `X ${roll.toFixed(2)} | Y ${yaw.toFixed(2)} | Z ${pitch.toFixed(2)}`
    			break
    		}
    		case Gizmos.SCALE: {
    			scaleRef.textContent = `X ${mainEntity.translation[0].toFixed(2)} | Y ${mainEntity.translation[1].toFixed(2)} | Z ${mainEntity.translation[2].toFixed(2)}`
    			break
    		}
    		}
    	})
    	EntitySelectionStore.getInstance().addListener(COMPONENT_ID, () => selectedSize = EntitySelectionStore.getEntitiesSelected().length)
    	SettingsStore.getInstance().addListener(COMPONENT_ID, data => {
    		gizmo = data.gizmo
    		isValidPivot = gizmo === GIZMOS.TRANSLATION && selectedSize === 1
    		isValidScaling = gizmo === GIZMOS.SCALE
    	}, ["gizmo"])
    	GizmoSystem.scaleRef = scaleRef
    })

    onDestroy(() => {
    	EntitySelectionStore.getInstance().removeListener(COMPONENT_ID)
    	SettingsStore.getInstance().removeListener(COMPONENT_ID)
    	GizmoSystem.removeListener(COMPONENT_ID)
    })
</script>

<div class="left-content" style={isOnGizmo ? undefined : "display: none"}>
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
<div class="right-content" style={isOnGizmo ? undefined : "display: none"}>
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
