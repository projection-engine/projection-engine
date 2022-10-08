<script>
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import Localization from "../../../../../shared/libs/Localization";
    import SettingsStore from "../../../../stores/SettingsStore";
    import CameraSettings from "./CameraSettings.svelte";

    export let settings

    const translate = key => Localization.PROJECT.VIEWPORT[key]
</script>

<Dropdown styles="width: clamp(250px, 10vw, 550px)">
    <button slot="button" data-viewbutton="-">
        {translate("VIEW")}
    </button>

    <button on:click={() => SettingsStore.updateStore({...settings, gridVisibility: !settings.gridVisibility})}>
        {#if settings.gridVisibility}
            <Icon>check</Icon>
        {/if}
        {translate("GRID")}
    </button>

    <button on:click={() => SettingsStore.updateStore({...settings, iconsVisibility: !settings.iconsVisibility})}>
        {#if settings.iconsVisibility}
            <Icon>check</Icon>
        {/if}
        {translate("ICONS")}
    </button>

    <button on:click={() => SettingsStore.updateStore({...settings, background: !settings.background})}>
        {#if settings.background}
            <Icon>check</Icon>
        {/if}
        {translate("BACKGROUND")}
    </button>
    <div data-divider="-"></div>
    <CameraSettings/>
</Dropdown>