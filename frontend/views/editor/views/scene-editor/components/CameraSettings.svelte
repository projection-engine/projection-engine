<script>
    import ViewportActions from "../../../lib/utils/ViewportActions";
    import focusOnCamera from "../../../utils/focus-on-camera";
    import Engine from "../../../../../../engine-core/Engine";
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import CameraGizmo from "./CameraGizmo.svelte";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";
    import ToolTip from "../../../../../components/tooltip/ToolTip.svelte";
    import Icon from "../../../../../components/icon/Icon.svelte";
    import SettingsStore from "../../../stores/SettingsStore";
    import CameraTracker from "../../../../../../engine-tools/lib/CameraTracker";
    import {onDestroy, onMount} from "svelte";
    import HierarchyController from "../../hierarchy/lib/HierarchyController";

    export let engine
    export let settings
    const internalID = crypto.randomUUID()
    let cameras = []

    const toggleProjection = () => SettingsStore.updateStore({...settings, camera: {...settings.camera, ortho: !settings.camera.ortho}})

    onMount(() => {
        HierarchyController.registerListener(internalID, () => {
            cameras = Engine.entities.array.filter(entity => entity.cameraComponent != null)
        })
    })
    onDestroy(() => HierarchyController.removeListener(internalID))
    $: CameraTracker.screenSpaceMovement = settings.screenSpaceMovement
</script>


<div class="wrapper">
    <Dropdown
            disabled={cameras.length === 0}
            buttonStyles={"border-radius: 25px; height: 25px;" + (engine.focusedCamera ? "background: var(--pj-accent-color);" : "background: var(--pj-background-tertiary);")}>
        <button
                disabled={cameras.length === 0}
                slot="button"
                style="background: transparent; box-shadow: none"
                class="button viewport"
                data-highlight={engine.focusedCamera ? "-" : undefined}
        >
            <ToolTip content={LOCALIZATION_EN.FOCUS_ON_CAMERA}/>
            <Icon styles="font-size: 1rem">videocam</Icon>
        </button>
        {#each cameras as camera}
            <button
                    style="border: none"
                    class="button viewport"
                    on:click={_ => focusOnCamera(camera)}
            >
                {#if engine.focusedCamera === camera.id}
                    <Icon>check</Icon>
                {:else}
                    <div style="width: 1.1rem"></div>
                {/if}
                {camera.name}
            </button>
        {/each}
    </Dropdown>
    <button disabled={engine.focusedCamera} class="button viewport" on:click={toggleProjection}>
        <ToolTip content={LOCALIZATION_EN.SWITCH_PROJECTION}/>
        {#if !settings.camera.ortho}
            <div style="width: 20px; height: 20px; perspective: 40px; transform-style: preserve-3d">
                <Icon styles="transform: rotateX(45deg)">grid_on</Icon>
            </div>
        {:else}
            <Icon styles="font-size: 1rem">grid_on</Icon>
        {/if}
    </button>

    <button disabled={engine.focusedCamera} class="button viewport" style="max-width: 25px; justify-content: center"
            on:click={() => ViewportActions.focus()}>
        <ToolTip content={LOCALIZATION_EN.FOCUS}/>
        <Icon styles="font-size: 1rem">my_location</Icon>
    </button>

    <button disabled={engine.focusedCamera} class="button viewport" style="max-width: 25px; justify-content: center"
            on:click={() => SettingsStore.updateStore({...settings, screenSpaceMovement: !settings.screenSpaceMovement})}>
        <ToolTip content={LOCALIZATION_EN.TOGGLE_CAMERA_MOVEMENT}/>
        {#if settings.screenSpaceMovement}
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