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
    <legend>{Localization.CAMERA_GIZMO}</legend>
    <div data-form="-">
        <Range
                label={Localization.SIZE}
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
    <legend>{Localization.GIZMOS}</legend>
    <div data-form="-">
        <Range
                label={Localization.SENSITIVITY}
                onFinish={v => {
                    SettingsStore.updateStore({...settings, gizmoGrid:{...settings.gizmoGrid, sensitivity: v / 100}})
                }}
                integer={true}
                value={settings.gizmoGrid.sensitivity  * 100}
                minValue={1}
        />
    </div>
</fieldset>

<fieldset>
    <legend>{Localization.RESOLUTION}</legend>
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
                checked={settings.overlays}
                handleCheck={() => {
                    update("overlays", !settings.overlays)
                }}
                label={Localization.SHOW_OVERLAY}
        />
    </div>
</fieldset>

