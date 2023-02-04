<script>
    import ShadingOption from "./components/ShadingModels.svelte";

    import AddOptions from "./components/AddOptions.svelte";
    import LOCALIZATION_EN from "../../../shared/static/LOCALIZATION_EN";
    import CameraSettings from "../inspector/components/engine/CameraPreferences.svelte";
    import ObjectOptions from "./components/ObjectOptions.svelte";
    import SpawnSettings from "./components/SpawnSettings.svelte";
    import getDropdownHeaderStyles from "../../../shared/components/dropdown/utils/get-dropdown-header-styles";
    import SettingsStore from "../../../shared/stores/SettingsStore";
    import Icon from "../../../shared/components/icon/Icon.svelte";
    import ToolTip from "../../../shared/components/tooltip/ToolTip.svelte";
    import Dropdown from "../../../shared/components/dropdown/Dropdown.svelte";
    import PREFERENCES from "../../../window-preferences/static/PREFERENCES";
    import FormPreferences from "../../../window-preferences/components/content/ContentGroup.svelte";

    export let settings
    export let engine

</script>


<div class="left-content">
    <AddOptions/>
    <ObjectOptions settings={settings}/>
    <SpawnSettings settings={settings}/>
</div>

<div class="right-content">
    <Dropdown styles="width: 250px" buttonStyles={getDropdownHeaderStyles()}>
        <button data-sveltebuttondefault="-"  slot="button" data-svelteview-header-dropdown="-">
            <Icon styles="font-size: 1rem">layers</Icon>
            <ToolTip content={LOCALIZATION_EN.OVERLAY}/>
        </button>

        <button data-sveltebuttondefault="-"  on:click={() => SettingsStore.updateStore({...settings, showGrid: !settings.showGrid})}>
            {#if settings.showGrid}
                <Icon styles="font-size: 1rem">check</Icon>
            {:else}
                <div style="width: 1.1rem"></div>
            {/if}
            {LOCALIZATION_EN.GRID}
        </button>
        <button data-sveltebuttondefault="-"  on:click={() => SettingsStore.updateStore({...settings, showIcons: !settings.showIcons})}>
            {#if settings.showIcons}
                <Icon styles="font-size: 1rem">check</Icon>
            {:else}
                <div style="width: 1.1rem"></div>
            {/if}
            {LOCALIZATION_EN.ICONS}
        </button>
        <button data-sveltebuttondefault="-"  on:click={() => SettingsStore.updateStore({...settings, showLines: !settings.showLines})}>
            {#if settings.showLines}
                <Icon styles="font-size: 1rem">check</Icon>
            {:else}
                <div style="width: 1.1rem"></div>
            {/if}
            {LOCALIZATION_EN.LINES}
        </button>

        <button data-sveltebuttondefault="-"  on:click={() => SettingsStore.updateStore({...settings, showOutline: !settings.showOutline})}>
            {#if settings.showOutline}
                <Icon styles="font-size: 1rem">check</Icon>
            {:else}
                <div style="width: 1.1rem"></div>
            {/if}
            {LOCALIZATION_EN.OUTLINE}
        </button>
    </Dropdown>
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