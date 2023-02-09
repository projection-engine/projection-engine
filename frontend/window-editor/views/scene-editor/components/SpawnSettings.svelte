<script>
    import LOCALIZATION_EN from "../../../../../static/objects/LOCALIZATION_EN";
    import SettingsStore from "../../../../shared/stores/SettingsStore";
    import Checkbox from "../../../../shared/components/checkbox/Checkbox.svelte";
    import getDropdownHeaderStyles from "../../../../shared/components/dropdown/utils/get-dropdown-header-styles";
    import Range from "../../../../shared/components/range/Range.svelte";
    import Dropdown from "../../../../shared/components/dropdown/Dropdown.svelte";

    export let settings

</script>

<Dropdown styles="width: 250px; max-height: 40vh; overflow-y: auto"  buttonStyles={getDropdownHeaderStyles()}>
    <button data-sveltebuttondefault="-"  slot="button" data-svelteview-header-dropdown="-">
        {LOCALIZATION_EN.SPAWNING}
    </button>
    <div class="group">
        <Range
                label={LOCALIZATION_EN.DISTANCE}
                minValue={.001}
                value={settings.spawnDistanceFromCamera}
                onFinish={v => SettingsStore.updateStore({...settings, spawnDistanceFromCamera: v})}
        />
        <div data-sveltedivider="-"></div>
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