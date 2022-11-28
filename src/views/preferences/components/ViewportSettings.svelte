<script>
    import Checkbox from "../../../components/checkbox/Checkbox.svelte";
    import ColorPicker from "shared-resources/frontend/components/color-picker/ColorPicker.svelte";
    import Range from "shared-resources/frontend/components/range/Range.svelte";
    import Localization from "../../../templates/LOCALIZATION_EN";
    import SettingsStore from "../../../stores/SettingsStore";

    export let settings
    function update(key, value) {
        SettingsStore.updateStore({...settings, [key]: value})
    }

</script>
<fieldset>
    <legend>{Localization.RESOLUTION}</legend>
    <div data-form="-">
        <Range
                label={"X"}
                variant={"embedded"}
                onFinish={v => {
                update("resolution", [v, settings.resolution[1]])
            }}
                incrementPercentage={1}
                handleChange={() => null}
                value={settings.resolution[0]}
                minValue={1}
        />
        <Range
                label={"Y"}
                variant={"embedded"}
                onFinish={v => {
                update("resolution", [settings.resolution[0], v])
            }}
                incrementPercentage={1}
                handleChange={() => null}
                value={settings.resolution[1]}
                minValue={1}
        />
    </div>
</fieldset>

<fieldset>
    <legend>{Localization.VIEWPORT}</legend>
    <div data-form="-">
        <Checkbox
                checked={settings.gridVisibility}
                handleCheck={() => {
            update("gridVisibility",  !settings.gridVisibility)
        }}
                label={Localization.GRID_VISIBILITY}
        />
        <Checkbox
                checked={settings.iconsVisibility}
                handleCheck={() => {
            update("iconsVisibility",  !settings.iconsVisibility)
        }}
                label={Localization.ICON_VISIBILITY}
        />
    </div>
</fieldset>
