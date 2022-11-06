<script>
    import Range from "shared-resources/frontend/components/range/Range.svelte"
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte"
    import LOCALIZATION_EN from "../../../templates/LOCALIZATION_EN";
    import SettingsStore from "../../../stores/SettingsStore";
    import Checkbox from "../../../components/checkbox/Checkbox.svelte";

    export let settings

</script>

<Dropdown styles="width: 250px; max-height: 40vh; overflow-y: auto">
    <button slot="button" data-viewbutton="-" style="background: transparent;">
        {LOCALIZATION_EN.SPAWNING}
    </button>
    <div class="group">
        <Range
                label={LOCALIZATION_EN.DISTANCE}
                minValue={.001}
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