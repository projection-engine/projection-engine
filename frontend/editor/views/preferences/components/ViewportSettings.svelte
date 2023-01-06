<script>
    import Checkbox from "../../../../components/checkbox/Checkbox.svelte";
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import SettingsStore from "../../../stores/SettingsStore";
    import ColorPicker from "../../../../components/color-picker/ColorPicker.svelte";
    import Range from "../../../../components/range/Range.svelte";

    export let settings

    function update(key, value) {
        SettingsStore.updateStore({...settings, [key]: value})
    }

</script>


<fieldset>
    <legend>{LOCALIZATION_EN.CAMERA_GIZMO}</legend>
    <div data-form="-">
        <Range
                label={LOCALIZATION_EN.SIZE}
                onFinish={v => {
                    update("cameraGizmoSize", v)
                }}
                integer={true}
                value={settings.cameraGizmoSize}
                minValue={10}
        />

    </div>
</fieldset>

<fieldset>
    <legend>{LOCALIZATION_EN.ICONS}</legend>
    <div data-form="-">
        <Range
                label={LOCALIZATION_EN.SIZE}
                onFinish={v => {
                    update("iconScale", v)
                }}
                value={settings.iconScale}
                minValue={.01}
        />
        <fieldset style="padding: 0">
            <legend>{LOCALIZATION_EN.CULLING}</legend>
            <Range
                    label={LOCALIZATION_EN.MAX_DISTANCE}
                    onFinish={v => {
                        update("maxDistanceIcon", v)
                    }}
                    integer={true}
                    value={settings.maxDistanceIcon}
                    minValue={1}
            />
        </fieldset>
    </div>
</fieldset>



<fieldset>
    <legend>{LOCALIZATION_EN.GIZMOS}</legend>
    <div data-form="-">
        <Range
                label={LOCALIZATION_EN.SENSITIVITY}
                onFinish={v => {
                    SettingsStore.updateStore({...settings, gizmoGrid:{...settings.gizmoGrid, sensitivity: v / 100}})
                }}
                value={settings.gizmoGrid.sensitivity  * 100}
                minValue={1}
        />
    </div>
</fieldset>

<fieldset>
    <legend>{LOCALIZATION_EN.RESOLUTION}</legend>
    <div data-form="-">
        <Range
                label={"X"}
                onFinish={v => {
                    update("resolution", [v, settings.resolution[1]])
                }}
                integer={true}
                value={settings.resolution[0]}
                minValue={1}
        />
        <Range
                label={"Y"}
                onFinish={v => {
                    update("resolution", [settings.resolution[0], v])
                }}
                integer={true}
                value={settings.resolution[1]}
                minValue={1}
        />
    </div>
</fieldset>


<fieldset>
    <legend>{LOCALIZATION_EN.VIEWPORT}</legend>
    <div data-form="-">
        <Checkbox
                checked={settings.showGrid}
                handleCheck={() => {
                    update("showGrid", !settings.showGrid)
                }}
                label={LOCALIZATION_EN.GRID}
        />
        <Checkbox
                checked={settings.showIcons}
                handleCheck={() => {
                    update("showIcons", !settings.showIcons)
                }}
                label={LOCALIZATION_EN.ICONS}
        />
        <Checkbox
                checked={settings.showLines}
                handleCheck={() => {
                    update("showLines", !settings.showLines)
                }}
                label={LOCALIZATION_EN.LINES}
        />
        <Checkbox
                checked={settings.showOutline}
                handleCheck={() => {
                    update("showOutline", !settings.showOutline)
                }}
                label={LOCALIZATION_EN.OUTLINE}
        />
        <ColorPicker
                value={settings.outlineColor.map(v => v * 255)}
                label={LOCALIZATION_EN.OUTLINE}
                submit={({r,g,b}) => update("outlineColor", [r/255,g/255,b/255])}
        />
    </div>
</fieldset>

