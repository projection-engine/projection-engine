<script>
    import Checkbox from "../../../../../components/checkbox/Checkbox.svelte";
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import SettingsStore from "../../../stores/SettingsStore";
    import ColorPicker from "../../../../../components/color-picker/ColorPicker.svelte";
    import Range from "../../../../../components/range/Range.svelte";
    import Accordion from "../../../../../components/accordion/Accordion.svelte";
    import GridSystem from "../../../../../../engine-tools/runtime/GridSystem";

    export let settings
    let timeout

    function update(key, value) {
        SettingsStore.updateStore({...settings, [key]: value})
    }

</script>

<Accordion startOpen={true} title={LOCALIZATION_EN.VIEWPORT}>
    <fieldset>
        <legend>{LOCALIZATION_EN.ICONS}</legend>
        <div data-form="-">
            <Range
                    label={LOCALIZATION_EN.SIZE}
                    onFinish={v => update("iconScale", v)}
                    handleChange={v => settings.iconScale = v}
                    value={settings.iconScale}
                    minValue={.01}
            />

            <Range
                    label={LOCALIZATION_EN.CULLING_DISTANCE}
                    onFinish={v => update("maxDistanceIcon", v)}
                    handleChange={v => settings.maxDistanceIcon = v}
                    integer={true}
                    value={settings.maxDistanceIcon}
                    minValue={1}
            />

        </div>
    </fieldset>
    <fieldset>
        <legend>{LOCALIZATION_EN.OVERLAY}</legend>
        <div data-form="-">
            <Checkbox
                    checked={settings.showGrid}
                    handleCheck={() => update("showGrid", !settings.showGrid)}
                    label={LOCALIZATION_EN.GRID}
            />
            <Checkbox
                    checked={settings.showIcons}
                    handleCheck={() => update("showIcons", !settings.showIcons)}
                    label={LOCALIZATION_EN.ICONS}
            />
            <Checkbox
                    checked={settings.showLines}
                    handleCheck={() => update("showLines", !settings.showLines)}
                    label={LOCALIZATION_EN.LINES}
            />
            <Checkbox
                    checked={settings.showOutline}
                    handleCheck={() => update("showOutline", !settings.showOutline)}
                    label={LOCALIZATION_EN.OUTLINE}
            />
            <ColorPicker
                    value={settings.outlineColor.map(v => v * 255)}
                    label={LOCALIZATION_EN.OUTLINE}
                    timeout={0}
                    submit={({r,g,b}) => {
                        settings.outlineColor = [r/255,g/255,b/255]
                        clearTimeout(timeout)
                        timeout = setTimeout(() => update("outlineColor", [r/255,g/255,b/255]),150)
                    }}
            />
            <Range
                    label={LOCALIZATION_EN.OUTLINE_WIDTH}
                    onFinish={v => update("outlineWidth", v)}
                    handleChange={v => settings.outlineWidth = v}
                    value={settings.outlineWidth}
                    minValue={.001}

            />

        </div>
    </fieldset>
</Accordion>


<Accordion title={LOCALIZATION_EN.GRID}>
    <fieldset>
        <legend>{LOCALIZATION_EN.COLOR}</legend>
        <div data-form="-">

            <Range
                    minValue={0}
                    maxValue={1}
                    label={LOCALIZATION_EN.BRIGHTNESS}

                    onFinish={(v) => update("gridColor", v)}
                    handleChange={v => GridSystem.buffer[0] = v }
                    value={settings.gridColor}
            />
            <Range

                    minValue={0}
                    maxValue={1}
                    label={LOCALIZATION_EN.OPACITY}

                    onFinish={(v) => update("gridOpacity", v)}
                    handleChange={v => GridSystem.buffer[3] = v}
                    value={settings.gridOpacity}
            />

        </div>
    </fieldset>
    <fieldset>
        <legend>{LOCALIZATION_EN.DIMENSIONS}</legend>
        <div data-form="-">
            <Range
                    increment={.01}
                    minValue={.001}
                    label={LOCALIZATION_EN.THRESHOLD}

                    onFinish={(v) => update("gridThreshold", v)}
                    handleChange={v => GridSystem.buffer[2] = v}
                    value={settings.gridThreshold}
            />
            <Range
                    increment={.0001}
                    minValue={.00001}
                    label={LOCALIZATION_EN.SCALE}

                    onFinish={(v) => update("gridScale", v)}
                    handleChange={v => {
                    GridSystem.buffer[1] = v*20
                }}
                    value={settings.gridScale}
            />


        </div>
    </fieldset>
</Accordion>


<Accordion title={LOCALIZATION_EN.CAMERA_GIZMO}>
    <div data-form="-">
        <Range
                label={LOCALIZATION_EN.SIZE}
                onFinish={v => update("cameraGizmoSize", v)}
                integer={true}
                value={settings.cameraGizmoSize}
                minValue={10}
        />

    </div>
</Accordion>


<Accordion title={LOCALIZATION_EN.GIZMOS}>
    <Range
            label={LOCALIZATION_EN.SENSITIVITY}
            onFinish={v => update("gizmoGrid", {...settings.gizmoGrid, sensitivity: v / 100})}
            value={settings.gizmoGrid.sensitivity  * 100}
            minValue={1}
    />
</Accordion>
