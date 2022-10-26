<script>
    import Checkbox from "../../../components/checkbox/Checkbox.svelte";
    import ColorPicker from "shared-resources/frontend/components/color-picker/ColorPicker.svelte";
    import Range from "shared-resources/frontend/components/range/Range.svelte";
    import Localization from "../../../templates/Localization";

    export let settings
    export let update

</script>
<fieldset>
    <legend>{Localization.RESOLUTION}</legend>
    <div class="content">
        <Range
                label={"X"}
                variant={"embedded"}
                onFinish={v => {
                update("resolution", [v, settings.resolution[1]])
            }}
                incrementPercentage={1}
                precision={0}
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
                precision={0}
                handleChange={() => null}
                value={settings.resolution[1]}
                minValue={1}
        />
    </div>
</fieldset>


<fieldset>
    <legend>{Localization.BACKGROUND}</legend>
    <div class="content">
        <Checkbox
                checked={settings.background}
                handleCheck={() => {
                update("background",  !settings.background)
            }}
                label={Localization.ENABLED}
        />
        <ColorPicker
                label={Localization.COLOR}
                value={settings.backgroundColor.map(c => c*255)}
                submit={(color) => {
            update("backgroundColor", Object.values(color).map(c => c/255))
        }}
        />
    </div>
</fieldset>


<fieldset>
    <legend>{Localization.VIEWPORT}</legend>
    <div class="content">
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

<style>
    legend {
        font-size: .8rem;
    }

    .content {
        padding-left: 25%;
        display: grid;
        gap: 4px;
    }
</style>
