<script>
    import Range from "shared-resources/frontend/components/range/Range.svelte";
    import Localization from "../../../templates/LOCALIZATION_EN";
    import SettingsStore from "../../../stores/SettingsStore";
    import Checkbox from "../../../components/checkbox/Checkbox.svelte";
    import GridSystem from "../../../lib/engine-tools/runtime/GridSystem";

    export let settings

    function update(key, value) {
        SettingsStore.updateStore({...settings, [key]: value})
    }

</script>


<fieldset>
    <div data-form="-">
        <Checkbox
                checked={settings.gridVisibility}
                handleCheck={() => update("gridVisibility",  !settings.gridVisibility )}
                label={Localization.ENABLED}
        />
        <Checkbox
                checked={settings.showGridSubdivision}
                handleCheck={() => update("showGridSubdivision", !settings.showGridSubdivision)}
                label={Localization.SUB_DIVISION}
        />
        <Range
                minLabelWidth={"30px"}
                minValue={.001}
                label={Localization.BRIGHTNESS}
                variant="embedded"
                incrementPercentage={1}
                onFinish={(v) => update("gridOpacity", v)}
                handleChange={v => {
                    GridSystem.metadataBuffer[0] = v
                }}
                value={settings.gridOpacity}
        />

    </div>
</fieldset>


