<script>
    import ViewportActionUtil from "../../../services/ViewportActionUtil"
    import Engine from "../../../../../engine/core/Engine"
    import CameraGizmo from "./CameraGizmo.svelte"
    import Dropdown from "../../../../shared/components/dropdown/Dropdown.svelte"
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte"
    import Icon from "../../../../shared/components/icon/Icon.svelte"
    import SettingsStore from "../../../../shared/stores/SettingsStore"
    import CameraTracker from "../../../../../engine/tools/utils/CameraTracker"
    import {onDestroy, onMount} from "svelte"
    import EntityHierarchyService from "../../../services/engine/EntityHierarchyService"
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"
    import EmptyIcon from "../../../../shared/components/icon/EmptyIcon.svelte"
    import EditorUtil from "../../../util/EditorUtil"
    import EngineStore from "../../../../shared/stores/EngineStore"

    const COMPONENT_ID = crypto.randomUUID()
    let cameras = []
    let focusedCamera
    let screenSpaceMovement = false
    let camera = {}


    onMount(() => {
    	SettingsStore.getInstance().addListener(COMPONENT_ID, data => {
    		CameraTracker.screenSpaceMovement = screenSpaceMovement = data.screenSpaceMovement
    		camera = data.camera
    	}, ["screenSpaceMovement", "camera"])
    	EngineStore.getInstance().addListener(COMPONENT_ID, data => focusedCamera = data.focusedCamera, ["focusedCamera"])
    	EntityHierarchyService.registerListener(COMPONENT_ID, () => {
    		// TODO - CONSUME FROM DYNAMIC LIST OF ENTITIES WITH COMPONENT AFTER ECS
    		cameras = Engine.entities.array.filter(entity => entity.cameraComponent != null)
    	})
    })

    onDestroy(() => {
    	SettingsStore.getInstance().removeListener(COMPONENT_ID)
    	EngineStore.getInstance().removeListener(COMPONENT_ID)
    	EntityHierarchyService.removeListener(COMPONENT_ID)
    })
    
    const toggleProjection = () => {
    	SettingsStore.updateStore({camera: {...camera, ortho: !camera.ortho}})
    }

</script>


<div class="wrapper">
    <Dropdown
            disabled={cameras.length === 0}
            buttonStyles={"border-radius: 25px; height: 25px;" + (focusedCamera ? "background: var(--pj-accent-color);" : "background: var(--pj-background-tertiary);")}>
        <button data-sveltebuttondefault="-"
                disabled={cameras.length === 0}
                slot="button"
                style="background: transparent; box-shadow: none"
                class="button viewport"
                data-sveltehighlight={focusedCamera ? "-" : undefined}
        >
            <ToolTip content={LocalizationEN.FOCUS_ON_CAMERA}/>
            <Icon styles="font-size: 1rem">videocam</Icon>
        </button>
        {#each cameras as camera}
            <button data-sveltebuttondefault="-"
                    style="border: none"
                    class="button viewport"
                    on:click={_ => EditorUtil.focusOnCamera(camera)}
            >
                {#if focusedCamera === camera.id}
                    <Icon>check</Icon>
                {:else}
                    <EmptyIcon/>
                {/if}
                {camera.name}
            </button>
        {/each}
    </Dropdown>
    <button data-sveltebuttondefault="-" disabled={focusedCamera} class="button viewport"
            on:click={toggleProjection}>
        <ToolTip content={LocalizationEN.SWITCH_PROJECTION}/>
        {#if !camera.ortho}
            <div style="width: 20px; height: 20px; perspective: 40px; transform-style: preserve-3d">
                <Icon styles="transform: rotateX(45deg)">grid_on</Icon>
            </div>
        {:else}
            <Icon styles="font-size: 1rem">grid_on</Icon>
        {/if}
    </button>

    <button data-sveltebuttondefault="-" disabled={focusedCamera} class="button viewport"
            style="max-width: 25px; justify-content: center"
            on:click={() => ViewportActionUtil.focus()}>
        <ToolTip content={LocalizationEN.FOCUS}/>
        <Icon styles="font-size: 1rem">my_location</Icon>
    </button>

    <button data-sveltebuttondefault="-" disabled={focusedCamera} class="button viewport"
            style="max-width: 25px; justify-content: center"
            on:click={() => SettingsStore.updateStore({screenSpaceMovement: !screenSpaceMovement})}>
        <ToolTip content={LocalizationEN.TOGGLE_CAMERA_MOVEMENT}/>
        {#if screenSpaceMovement}
            <Icon styles="font-size: 1rem">lock_outline</Icon>
        {:else}
            <Icon styles="font-size: 1rem">lock_open</Icon>
        {/if}
    </button>

    <CameraGizmo/>
</div>

<style>


    .wrapper {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: flex-start;
        gap: 4px;
    }

</style>