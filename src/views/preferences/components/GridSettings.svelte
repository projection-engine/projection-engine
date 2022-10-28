<script>
    import Range from "shared-resources/frontend/components/range/Range.svelte";
    import Localization from "../../../templates/LOCALIZATION_EN";
    import SettingsStore from "../../../stores/SettingsStore";
    import Checkbox from "../../../components/checkbox/Checkbox.svelte";
    import GridSystem from "../../../../public/engine/editor-environment/services/GridSystem";

    export let settings
</script>


<fieldset>
    <div data-form="-">
        <Checkbox
                checked={settings.gridVisibility}
                handleCheck={() => SettingsStore.updateStore({...settings, gridVisibility: !settings.gridVisibility })}
                label={Localization.ENABLED}
        />
        <Checkbox
                checked={settings.showGridSubdivision}
                handleCheck={() => SettingsStore.updateStore({...settings, showGridSubdivision: !settings.showGridSubdivision })}
                label={Localization.SUB_DIVISION}
        />
        <Range
                minLabelWidth={"30px"}
                minValue={.001}
                label={Localization.BRIGHTNESS}
                variant="embedded"
                incrementPercentage={1}
                onFinish={(v) => {
                    SettingsStore.updateStore({...SettingsStore.data, gridOpacity: v})
                }}
                handleChange={v => {
                    GridSystem.metadataBuffer[0] = v
                }}
                value={settings.gridOpacity}
        />

    </div>
</fieldset>


