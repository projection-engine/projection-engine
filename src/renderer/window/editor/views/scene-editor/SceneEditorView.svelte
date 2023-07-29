<script>
    import {onDestroy, onMount} from "svelte"
    import RENDER_TARGET from "../../static/RENDER_TARGET"
    import SelectBox from "../../../shared/components/select-box/SelectBox.svelte"
    import GIZMOS from "../../../../../shared/enums/Gizmos.ts"
    import GizmoSystem from "../../../../engine/tools/gizmo/GizmoSystem"
    import dragDrop from "../../../shared/components/drag-drop/drag-drop"
    import CameraSettings from "./components/CameraSettings.svelte"
    import SceneOptions from "./components/SceneOptions.svelte"
    import EngineStore from "../../../shared/stores/EngineStore"
    import SettingsStore from "../../../shared/stores/SettingsStore"
    import ViewHeader from "../../components/view/components/ViewHeader.svelte"
    import EntityInformation from "./components/EntityInformation.svelte"
    import Engine from "../../../../engine/core/Engine"
    import ViewportInteractionListener from "./lib/ViewportInteractionListener"
    import GizmoSettings from "./components/GizmoSettings.svelte"
    import SHADING_MODELS from "../../../../engine/core/static/SHADING_MODELS"
    import Icon from "../../../shared/components/icon/Icon.svelte"
    import ContextMenuService from "../../../shared/lib/context-menu/ContextMenuService"
    import GPU from "../../../../engine/core/GPU"
    import CameraAPI from "../../../../engine/core/lib/utils/CameraAPI"
    import LocalizationEN from "../../../../../shared/enums/LocalizationEN"
    import SceneEditorUtil from "../../util/SceneEditorUtil"
    import SerializedState from "../../components/view/SerializedState.svelte";
    import ViewStateStore from "../../../shared/stores/ViewStateStore";

    const COMPONENT_ID = crypto.randomUUID()
    const draggable = dragDrop(false)

    let isOnGizmo = false
    let isSelectBoxDisabled
    let executingAnimation = false
    let shadingModel
    let focusedCamera

    onMount(() => {
    	SettingsStore.getInstance().addListener(COMPONENT_ID, data => {
    		isSelectBoxDisabled = data.gizmo !== GIZMOS.NONE
    		shadingModel = data.shadingModel
    	}, ["gizmo", "shadingModel"])
    	EngineStore.getInstance().addListener(COMPONENT_ID, data => {
    		executingAnimation = data.executingAnimation
    		focusedCamera = data.focusedCamera ? Engine.entities.get(data.focusedCamera) : null
    	}, ["focusedCamera", "executingAnimation"])
    	GizmoSystem.onStart = () => isOnGizmo = true
    	GizmoSystem.onStop = () => isOnGizmo = false
        SceneEditorUtil.onSceneEditorMount(draggable)
        window.store = ViewStateStore
    })

    onDestroy(() => {
    	SettingsStore.getInstance().removeListener(COMPONENT_ID)
    	EngineStore.getInstance().removeListener(COMPONENT_ID)
    	GizmoSystem.onStop = GizmoSystem.onStart = undefined
    	ContextMenuService.getInstance().destroy(RENDER_TARGET)
    	draggable.onDestroy()
    	ViewportInteractionListener.destroy()
    })
</script>

<SerializedState
        onBeforeDestroy={CameraAPI.serializeState}
        onStateInitialize={state => {
            SceneEditorUtil.restoreCameraState(state)
        }}
/>
{#if !executingAnimation}
    <ViewHeader>
        <EntityInformation {isOnGizmo}/>
        <SceneOptions {isOnGizmo}/>
    </ViewHeader>
    <SelectBox
            targetElement={GPU.canvas}
            targetElementID={RENDER_TARGET}
            disabled={isSelectBoxDisabled}
            setSelected={SceneEditorUtil.getUnderSelectionBox}
            getSelected={() => []}
            nodes={[]}
    />
    <div class="top-bar">
        <GizmoSettings/>
        <CameraSettings/>
    </div>
    {#if focusedCamera != null}
        <div class="focused-camera" data-svelteinline="-">
            <Icon styles="font-size: .85rem">videocam</Icon>
            {focusedCamera.name}
        </div>
    {/if}
    {#if shadingModel === SHADING_MODELS.LIGHT_QUANTITY}
        <div class="complexity-gradient">
            <small>{LocalizationEN.NO_CONTRIBUTION}</small>
            <small>{LocalizationEN.ALL_SCENE_LIGHTS}</small>
        </div>
    {:else if shadingModel === SHADING_MODELS.LIGHT_COMPLEXITY}
        <div class="complexity-gradient">
            <small>{LocalizationEN.NO_CONTRIBUTION}</small>
            <small>{LocalizationEN.MAXIMUM_NUMBER_OF_LIGHTS}</small>
        </div>
    {/if}
{/if}

<style>
    .complexity-gradient {
        position: absolute;
        z-index: 10;
        bottom: 6px;
        left: 50%;
        transform: translateX(-50%);
        width: 75%;
        padding: 6px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        background: linear-gradient(0.25turn, blue, red);
        height: 40px;
        border-radius: 5px;
        box-shadow: rgb(0 0 0 / 20%) 2px 4px 10px 2px;
    }

    .focused-camera {
        position: absolute;
        bottom: 4px;
        left: 4px;
        border-radius: 25px;
        height: 25px;
        background: var(--pj-accent-color);
        color: white;
        gap: 6px;
        padding: 8px;
        font-size: .7rem;
        z-index: 999;
        box-shadow: var(--pj-boxshadow);
    }

    .top-bar {
        position: absolute;
        padding: 2px;

        z-index: 10;
        top: 28px;
        width: 100%;
        left: 0;

        display: flex;
        justify-content: space-between;
        align-items: flex-start;

    }
</style>
