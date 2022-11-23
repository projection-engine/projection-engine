<script>
    import GIZMOS from "../../../static/GIZMOS"
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import SettingsStore from "../../../stores/SettingsStore";
    import CameraAPI from "../../../../public/engine/lib/utils/CameraAPI";
    import ViewportActions from "../../../lib/utils/ViewportActions";
    import focusOnCamera from "../../../utils/focus-on-camera";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte"
    import Engine from "../../../../public/engine/Engine";
    import COMPONENTS from "../../../../public/engine/static/COMPONENTS";
    import LOCALIZATION_EN from "../../../templates/LOCALIZATION_EN";

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
                style="background: transparent"
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
    <button class="button viewport" on:click={toggleProjection} disabled>
        <ToolTip content={LOCALIZATION_EN.SWITCH_PROJECTION}/>
        {#if !cameraIsOrtho}
            <div style="width: 20px; height: 20px; perspective: 40px; transform-style: preserve-3d">
                <Icon styles="transform: rotateX(45deg)">grid_on</Icon>
            </div>
        {:else}
            <Icon styles="font-size: 1rem">grid_on</Icon>
        {/if}
    </button>

    <button class="button viewport" on:click={() => ViewportActions.focus()} style="margin-right: 8px">
        <ToolTip content={LOCALIZATION_EN.FOCUS}/>
        <Icon styles="font-size: 1rem">my_location</Icon>
    </button>
    <button

            class="button viewport"
            data-highlight={settings.gizmo === GIZMOS.NONE ? "-" : undefined}
            on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.NONE})}>
        <Icon styles="font-size: 1rem; color: #FFC757">highlight_alt</Icon>

        {LOCALIZATION_EN.SELECTION}

        <ToolTip content={LOCALIZATION_EN.SELECTION}/>
    </button>
    <button
            class="button viewport"
            data-highlight={settings.gizmo === GIZMOS.TRANSLATION ? "-" : undefined}
            on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.TRANSLATION})}>
        <Icon styles="font-size: 1rem; color: var(--pj-color-quaternary)">open_with</Icon>
        {LOCALIZATION_EN.T_GIZMO}

        <ToolTip content={LOCALIZATION_EN.T_GIZMO}/>
    </button>
    <button

            class="button viewport"
            data-highlight={settings.gizmo === GIZMOS.ROTATION ? "-" : undefined}
            on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.ROTATION})}>
        <Icon styles="font-size: 1rem; color: var(--pj-color-quaternary)">360</Icon>
        {LOCALIZATION_EN.R_GIZMO}

        <ToolTip content={LOCALIZATION_EN.R_GIZMO}/>
    </button>
    <button

            class="button viewport"
            data-highlight={settings.gizmo === GIZMOS.SCALE ? "-" : undefined}
            on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.SCALE})}>
        <Icon styles="font-size: 1rem; color: var(--pj-color-quaternary)">open_in_full</Icon>
        {LOCALIZATION_EN.S_GIZMO}
        <ToolTip content={LOCALIZATION_EN.S_GIZMO}/>
    </button>
    <button
            class="button viewport"
            style="width: fit-content; max-height: 25px; min-height: 25px"
            data-highlight={settings.visibleBuffers ? "-" : undefined}
            on:click={() => SettingsStore.updateStore({...settings, visibleBuffers: !settings.visibleBuffers})}
    >
        <Icon styles="font-size: 1rem; color: var(--pj-color-quaternary)">{settings.visibleBuffers ? "visibility" : "visibility_off"}</Icon>
        {!settings.visibleBuffers ? LOCALIZATION_EN.SHOW_BUFFERS : LOCALIZATION_EN.HIDE_BUFFERS}
    </button>
</div>

<style>


    .wrapper {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 3px;
    }

</style>