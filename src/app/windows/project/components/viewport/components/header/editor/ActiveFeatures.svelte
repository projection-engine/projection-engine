<script>
    import Dropdown from "../../../../../../../components/dropdown/Dropdown.svelte";
    import Icon from "../../../../../../../components/icon/Icon.svelte";
    import Localization from "../../../../../../../libs/Localization";
    import SettingsStore from "../../../../../stores/SettingsStore";

    export let settings

    const translate = key => Localization.PROJECT.VIEWPORT[key]
</script>

<Dropdown>
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
</Dropdown>