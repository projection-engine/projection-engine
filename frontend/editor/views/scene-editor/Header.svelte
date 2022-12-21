<script>
    import ShadingOption from "./components/ShadingModels.svelte";

    import AddOptions from "./components/AddOptions.svelte";
    import Localization from "../../templates/LOCALIZATION_EN";
    import LOCALIZATION_EN from "../../templates/LOCALIZATION_EN";
    import EntityStateController from "../../lib/controllers/EntityStateController";
    import CameraSettings from "../preferences/components/CameraSettings.svelte";
    import ObjectOptions from "./components/ObjectOptions.svelte";
    import SpawnSettings from "./components/SpawnSettings.svelte";
    import getDropdownHeaderStyles from "../../../shared/components/dropdown/utils/get-dropdown-header-styles";
    import SettingsStore from "../../stores/SettingsStore";
    import Icon from "../../../shared/components/icon/Icon.svelte";
    import ToolTip from "../../../shared/components/tooltip/ToolTip.svelte";
    import Dropdown from "../../../shared/components/dropdown/Dropdown.svelte";
    import ViewportSettings from "../preferences/components/ViewportSettings.svelte";

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
    <Dropdown styles="width: clamp(250px, 25vw, 500px)" buttonStyles={getDropdownHeaderStyles()}>
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
    <Dropdown styles="width: 250px" buttonStyles={getDropdownHeaderStyles()}>
        <button slot="button" data-view-header-dropdown="-">
            <Icon styles="font-size: 1rem">layers</Icon>
            <ToolTip content={LOCALIZATION_EN.OVERLAY}/>
        </button>

        <button on:click={() => SettingsStore.updateStore({...settings, showGrid: !settings.showGrid})}>
            {#if settings.showGrid}
                <Icon styles="font-size: 1rem">check</Icon>
            {:else}
                <div style="width: 1.1rem"></div>
            {/if}
            {LOCALIZATION_EN.GRID}
        </button>
        <button on:click={() => SettingsStore.updateStore({...settings, showIcons: !settings.showIcons})}>
            {#if settings.showIcons}
                <Icon styles="font-size: 1rem">check</Icon>
            {:else}
                <div style="width: 1.1rem"></div>
            {/if}
            {LOCALIZATION_EN.ICONS}
        </button>
        <button on:click={() => SettingsStore.updateStore({...settings, showLines: !settings.showLines})}>
            {#if settings.showLines}
                <Icon styles="font-size: 1rem">check</Icon>
            {:else}
                <div style="width: 1.1rem"></div>
            {/if}
            {LOCALIZATION_EN.LINES}
        </button>

        <button on:click={() => SettingsStore.updateStore({...settings, showOutline: !settings.showOutline})}>
            {#if settings.showOutline}
                <Icon styles="font-size: 1rem">check</Icon>
            {:else}
                <div style="width: 1.1rem"></div>
            {/if}
            {LOCALIZATION_EN.OUTLINE}
        </button>

    </Dropdown>
    <ShadingOption engine={engine} settings={settings}/>
    <Dropdown styles="width: clamp(250px, 25vw, 500px)" buttonStyles={getDropdownHeaderStyles()}>
        <div style="padding: 8px 4px">
            <ViewportSettings settings={settings}/>
        </div>
    </Dropdown>
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