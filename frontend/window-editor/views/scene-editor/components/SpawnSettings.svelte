<script>

    import SettingsStore from "../../../../shared/stores/SettingsStore"
    import Checkbox from "../../../../shared/components/checkbox/Checkbox.svelte"
    import getDropdownHeaderStyles from "../../../../shared/components/dropdown/utils/get-dropdown-header-styles"
    import Range from "../../../../shared/components/range/Range.svelte"
    import Dropdown from "../../../../shared/components/dropdown/Dropdown.svelte"
    import LocalizationEN from "../../../../../contants/LocalizationEN"

    export let settings

</script>

<Dropdown styles="width: 250px; max-height: 40vh; overflow-y: auto" buttonStyles={getDropdownHeaderStyles()}>
    <button data-sveltebuttondefault="-" slot="button" data-svelteview-header-dropdown="-">
        {LocalizationEN.SPAWNING}
    </button>
    <div class="group">
        <Range
                label={LocalizationEN.DISTANCE}
                minValue={.001}
                value={settings.spawnDistanceFromCamera}
                onFinish={v => SettingsStore.updateStore({...settings, spawnDistanceFromCamera: v})}
        />
        <div data-sveltedivider="-"></div>
        <Checkbox
                label={LocalizationEN.SPAWN_ON_ORIGIN}
                checked={settings.spawnOnOrigin}
                handleCheck={_ => SettingsStore.updateStore({...settings, spawnOnOrigin: !settings.spawnOnOrigin})}
        />
    </div>
</Dropdown>

<style>
    .group {
        padding: 6px;
        display: grid;
        gap: 3px;
    }
</style>