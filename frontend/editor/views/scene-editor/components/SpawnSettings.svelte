<script>
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import SettingsStore from "../../../stores/SettingsStore";
    import Checkbox from "../../../../components/checkbox/Checkbox.svelte";
    import getDropdownHeaderStyles from "../../../../components/dropdown/utils/get-dropdown-header-styles";
    import Range from "../../../../components/range/Range.svelte";
    import Dropdown from "../../../../components/dropdown/Dropdown.svelte";

    export let settings

</script>

<Dropdown styles="width: 250px; max-height: 40vh; overflow-y: auto"  buttonStyles={getDropdownHeaderStyles()}>
    <button slot="button" data-view-header-dropdown="-">
        {LOCALIZATION_EN.SPAWNING}
    </button>
    <div class="group">
        <Range
                label={LOCALIZATION_EN.DISTANCE}
                minValue={.001}
                value={settings.spawnDistanceFromCamera}
                onFinish={v => SettingsStore.updateStore({...settings, spawnDistanceFromCamera: v})}
        />
        <div data-divider="-"></div>
        <Checkbox
                label={LOCALIZATION_EN.SPAWN_ON_ORIGIN}
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