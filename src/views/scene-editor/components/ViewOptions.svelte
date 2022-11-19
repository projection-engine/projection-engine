<script>
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import Localization from "../../../templates/LOCALIZATION_EN";
    import SettingsStore from "../../../stores/SettingsStore";
    import getDropdownHeaderStyles from "../../../utils/get-dropdown-header-styles";

    export let settings
</script>

<Dropdown styles="width: clamp(250px, 10vw, 550px);"  buttonStyles={getDropdownHeaderStyles()}>
    <button slot="button" data-view-header-dropdown="-">
        {Localization.VIEW}
    </button>

    <button on:click={() => SettingsStore.updateStore({...settings, gridVisibility: !settings.gridVisibility})}>
        {#if settings.gridVisibility}
            <Icon>check</Icon>
        {:else}
            <div style="width: 1.1rem"></div>
        {/if}
        {Localization.GRID}
    </button>

    <button on:click={() => SettingsStore.updateStore({...settings, iconsVisibility: !settings.iconsVisibility})}>
        {#if settings.iconsVisibility}
            <Icon>check</Icon>
        {:else}
            <div style="width: 1.1rem"></div>
        {/if}
        {Localization.ICONS}
    </button>

    <button on:click={() => SettingsStore.updateStore({...settings, background: !settings.background})}>
        {#if settings.background}
            <Icon>check</Icon>
        {:else}
            <div style="width: 1.1rem"></div>
        {/if}
        {Localization.BACKGROUND}
    </button>

    <button on:click={() => SettingsStore.updateStore({...settings, showMetrics: !settings.showMetrics})}>
        {#if settings.showMetrics}
            <Icon>check</Icon>
        {:else}
            <div style="width: 1.1rem"></div>
        {/if}
        {Localization.METRICS}
    </button>

</Dropdown>