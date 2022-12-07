<script>
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import CameraAPI from "../../../../../public/engine/lib/utils/CameraAPI";
    import ViewportActions from "../../../lib/utils/ViewportActions";
    import focusOnCamera from "../../../utils/focus-on-camera";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte"
    import Engine from "../../../../../public/engine/Engine";
    import COMPONENTS from "../../../../../public/engine/static/COMPONENTS";
    import LOCALIZATION_EN from "../../../templates/LOCALIZATION_EN";
    import CameraGizmo from "../../../components/CameraGizmo.svelte";

    export let engine
    export let settings

    let cameraIsOrtho = false
    const toggleProjection = () => {
        const negated = !CameraAPI.isOrthographic
        CameraAPI.isOrthographic = negated
        CameraAPI.updateProjection()
        cameraIsOrtho = negated
    }
    $: cameras = engine.changeID ? Engine.entities.filter(entity => entity.components.get(COMPONENTS.CAMERA) != null) : []
</script>


<div class="wrapper">
    <Dropdown
            buttonStyles={"border-radius: 25px; height: 25px;" + (engine.focusedCamera ? "background: var(--pj-accent-color);" : "background: var(--pj-background-tertiary);")}>
        <button
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
    <button class="button viewport" on:click={toggleProjection}>
        <ToolTip content={LOCALIZATION_EN.SWITCH_PROJECTION}/>
        {#if !cameraIsOrtho}
            <div style="width: 20px; height: 20px; perspective: 40px; transform-style: preserve-3d">
                <Icon styles="transform: rotateX(45deg)">grid_on</Icon>
            </div>
        {:else}
            <Icon styles="font-size: 1rem">grid_on</Icon>
        {/if}
    </button>

    <button disabled={engine.focusedCamera} class="button viewport" style="max-width: 25px; justify-content: center" on:click={() => ViewportActions.focus()}>
        <ToolTip content={LOCALIZATION_EN.FOCUS}/>
        <Icon styles="font-size: 1rem">my_location</Icon>
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