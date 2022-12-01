<script>
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import ShadingOption from "../../components/shading-option/ShadingOption.svelte";

    import AddOptions from "./components/AddOptions.svelte";
    import Localization from "../../templates/LOCALIZATION_EN";
    import LOCALIZATION_EN from "../../templates/LOCALIZATION_EN";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte"
    import EntityStateController from "../../lib/controllers/EntityStateController";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte"
    import CameraSettings from "../preferences/components/CameraSettings.svelte";
    import ObjectOptions from "./components/ObjectOptions.svelte";
    import SpawnSettings from "./components/SpawnSettings.svelte";
    import getDropdownHeaderStyles from "../../utils/get-dropdown-header-styles";
    import SettingsStore from "../../stores/SettingsStore";

    export let settings
    export let engine

</script>


<div class="left-content">
    <button
            on:click={() => EntityStateController.startPlayState()}
            data-view-header-button="-"
    >
        <Icon styles="font-size: 1rem">play_arrow</Icon>
        <ToolTip content={Localization.PLAY}/>
    </button>
    <div data-vertdivider="-" style="height: 15px; margin: 0"></div>
    <AddOptions/>
    <Dropdown styles="width: 250px" buttonStyles={getDropdownHeaderStyles()}>
        <button slot="button" data-view-header-dropdown="-">
            {Localization.CAMERA}
        </button>
        <div style="padding: 8px 4px">
            <CameraSettings/>
        </div>
    </Dropdown>

    <ObjectOptions settings={settings}/>
    <SpawnSettings settings={settings}/>
</div>

<div class="right-content">
    <button data-view-header-button="-" data-highlight={settings.outlineEnabled ? "-" : undefined}
            on:click={() => SettingsStore.updateStore({...settings, outlineEnabled: !settings.outlineEnabled})}>
        <Icon styles="font-size: 1rem">border_outer</Icon>
        <ToolTip content={LOCALIZATION_EN.OUTLINE}/>
    </button>
    <button data-view-header-button="-" data-highlight={settings.overlays ? "-" : undefined}
            on:click={() => SettingsStore.updateStore({...settings, overlays: !settings.overlays})}>
        <Icon styles="font-size: 1rem">layers</Icon>
        <ToolTip content={LOCALIZATION_EN.OVERLAY}/>
    </button>
    <ShadingOption engine={engine} settings={settings}/>
</div>


<style>
    .left-content {
        display: flex;
        align-items: center;
        gap: 4px;
        justify-content: flex-start;
        width: 100%;
    }

    .right-content {
        display: flex;
        align-items: center;
        gap: 4px;
        justify-content: flex-end;
        width: 100%;

    }

</style>