<script>
    import GIZMOS from "../../../static/GIZMOS"
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import SettingsStore from "../../../stores/SettingsStore";
    import "../../viewport/css/styles.css"
    import Localization from "../../../templates/LOCALIZATION_EN";
    import CameraAPI from "../../../../public/engine/api/CameraAPI";
    import ViewportActions from "../../../lib/ViewportActions";
    import focusOnCamera from "../../../utils/focus-on-camera";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte"
    import Engine from "../../../../public/engine/Engine";
    import COMPONENTS from "../../../../public/engine/static/COMPONENTS";

    export let engine
    export let settings

    let hidden = false
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
    <Dropdown buttonStyles={"border-radius: 3px; border: var(--pj-border-primary) 1px solid;" + (engine.focusedCamera ? "background: var(--pj-accent-color);" : "background: var(--pj-background-tertiary);")}>
        <button
                slot="button"
                style="border: none; background: transparent"
                class="button viewport"
                data-highlight={engine.focusedCamera ? "-" : undefined}
        >
            <ToolTip content={Localization.FOCUS_ON_CAMERA}/>
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
        <ToolTip content={Localization.SWITCH_PROJECTION}/>
        {#if !cameraIsOrtho}
            <div style="width: 20px; height: 20px; perspective: 40px; transform-style: preserve-3d">
                <Icon styles="transform: rotateX(45deg)">grid_on</Icon>
            </div>
        {:else}
            <Icon styles="font-size: 1rem">grid_on</Icon>
        {/if}
    </button>

    <button class="button viewport" on:click={() => ViewportActions.focus()} style="margin-right: 8px">
        <ToolTip content={Localization.FOCUS}/>
        <Icon styles="font-size: 1rem">my_location</Icon>
    </button>
    <button
            class:visible={!hidden}
            class="button viewport"
            data-highlight={settings.gizmo === GIZMOS.NONE ? "-" : undefined}
            on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.NONE})}>
        <Icon styles="font-size: 1.15rem; color: #FFC757">highlight_alt</Icon>
        {#if !hidden}
            {Localization.SELECTION}
        {/if}
        <ToolTip content={Localization.SELECTION}/>
    </button>
    <button
            class:visible={!hidden}
            class="button viewport"
            data-highlight={settings.gizmo === GIZMOS.TRANSLATION ? "-" : undefined}
            on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.TRANSLATION})}>
        <Icon styles="font-size: 1.15rem; color: var(--pj-color-quaternary)">open_with</Icon>
        {#if !hidden}
            {Localization.T_GIZMO}
        {/if}
        <ToolTip content={Localization.T_GIZMO}/>
    </button>
    <button
            class:visible={!hidden}
            class="button viewport"
            data-highlight={settings.gizmo === GIZMOS.ROTATION ? "-" : undefined}
            on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.ROTATION})}>
        <Icon styles="font-size: 1.15rem; color: var(--pj-color-quaternary)">360</Icon>
        {#if !hidden}
            {Localization.R_GIZMO}
        {/if}
        <ToolTip content={Localization.R_GIZMO}/>
    </button>
    <button
            class:visible={!hidden}
            class="button viewport"
            data-highlight={settings.gizmo === GIZMOS.SCALE ? "-" : undefined}
            on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.SCALE})}>
        <Icon styles="font-size: 1.15rem; color: var(--pj-color-quaternary)">open_in_full</Icon>
        {#if !hidden}
            {Localization.S_GIZMO}
        {/if}
        <ToolTip content={Localization.S_GIZMO}/>
    </button>
</div>

<style>
    .visible {
        justify-content: flex-start;
        gap: 4px;
        white-space: nowrap;
        overflow: hidden;
        padding: 0 4px;
    }

    .wrapper {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 3px;
    }

</style>