<script>
    import Localization from "../../../../static/LOCALIZATION_EN";
    import SettingsStore from "../../../stores/SettingsStore";
    import GridSystem from "../../../../../engine-tools/runtime/GridSystem";
    import Range from "../../../../components/range/Range.svelte";

    export let settings

    function update(key, value) {
        SettingsStore.updateStore({...settings, [key]: value})
    }

</script>

<fieldset>
    <legend>{Localization.COLOR}</legend>
    <div data-form="-">

        <Range
                minValue={0}
                maxValue={1}
                label={Localization.BRIGHTNESS}

                onFinish={(v) => update("gridColor", v)}
                handleChange={v => {
                    GridSystem.buffer[0] = v
                }}
                value={settings.gridColor}
        />
        <Range

                minValue={0}
                maxValue={1}
                label={Localization.OPACITY}

                onFinish={(v) => update("gridOpacity", v)}
                handleChange={v => {
                    GridSystem.buffer[3] = v
                }}
                value={settings.gridOpacity}
        />

    </div>
</fieldset>


<fieldset>
    <legend>{Localization.DIMENSIONS}</legend>
    <div data-form="-">
        <Range
                increment={.01}
                minValue={.001}
                label={Localization.THRESHOLD}

                onFinish={(v) => update("gridThreshold", v)}
                handleChange={v => {
                    GridSystem.buffer[2] = v
                }}
                value={settings.gridThreshold}
        />
        <Range
                increment={.0001}
                minValue={.00001}
                label={Localization.SCALE}

                onFinish={(v) => update("gridScale", v)}
                handleChange={v => {
                    GridSystem.buffer[1] = v*20
                }}
                value={settings.gridScale}
        />


    </div>
</fieldset>


