<script>
    import GIZMOS from "../../../data/GIZMOS"
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import SettingsStore from "../../../stores/SettingsStore";
    import "../../viewport/css/styles.css"
    import Localization from "../../../templates/Localization";
    import CameraAPI from "../../../../public/engine/lib/apis/CameraAPI";
    import ViewportActions from "../../../libs/ViewportActions";

    let hidden = false
    let cameraIsOrtho = false
    export let settings

    const translate = key => Localization.PROJECT.VIEWPORT[key]
    const toggleProjection = () => {
        const negated = !CameraAPI.isOrthographic
        CameraAPI.isOrthographic = negated
        CameraAPI.updateProjection()
        cameraIsOrtho = negated
    }
</script>


<div class="wrapper">
    <button class="button viewport" disabled>
        <ToolTip content={translate("SWITCH_BETWEEN_CAMERAS")}/>
        <Icon styles="font-size: 1rem">videocam</Icon>
    </button>
    <button class="button viewport" on:click={toggleProjection} disabled>
        <ToolTip content={translate("SWITCH_PROJECTION")}/>
        {#if !cameraIsOrtho}
            <div style="width: 20px; height: 20px; perspective: 40px; transform-style: preserve-3d">
                <Icon styles="transform: rotateX(45deg)">grid_on</Icon>
            </div>
        {:else}
            <Icon styles="font-size: 1rem">grid_on</Icon>
        {/if}
    </button>

    <button class="button viewport" on:click={() => ViewportActions.focus()} style="margin-right: 8px">
        <ToolTip content={translate("FOCUS")}/>
        <Icon styles="font-size: 1rem">my_location</Icon>
    </button>
    <button
            class:visible={!hidden}
            class="button viewport"
            data-highlight={settings.gizmo === GIZMOS.NONE ? "-" : undefined}
            on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.NONE})}>
        <Icon styles="font-size: 1.15rem; color: #FFC757">highlight_alt</Icon>
        {#if !hidden}
            {translate("SELECTION")}
        {/if}
        <ToolTip content={translate("SELECTION")}/>
    </button>
    <button
            class:visible={!hidden}
            class="button viewport"
            data-highlight={settings.gizmo === GIZMOS.TRANSLATION ? "-" : undefined}
            on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.TRANSLATION})}>
        <Icon styles="font-size: 1.15rem; color: var(--pj-color-quaternary)">open_with</Icon>
        {#if !hidden}
            {translate("T_GIZMO")}
        {/if}
        <ToolTip content={translate("T_GIZMO")}/>
    </button>
    <button
            class:visible={!hidden}
            class="button viewport"
            data-highlight={settings.gizmo === GIZMOS.ROTATION ? "-" : undefined}
            on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.ROTATION})}>
        <Icon styles="font-size: 1.15rem; color: var(--pj-color-quaternary)">360</Icon>
        {#if !hidden}
            {translate("R_GIZMO")}
        {/if}
        <ToolTip content={translate("R_GIZMO")}/>
    </button>
    <button
            class:visible={!hidden}
            class="button viewport"
            data-highlight={settings.gizmo === GIZMOS.SCALE ? "-" : undefined}
            on:click={() => SettingsStore.updateStore({...settings, gizmo: GIZMOS.SCALE})}>
        <Icon styles="font-size: 1.15rem; color: var(--pj-color-quaternary)">open_in_full</Icon>
        {#if !hidden}
            {translate("S_GIZMO")}
        {/if}
        <ToolTip content={translate("S_GIZMO")}/>
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