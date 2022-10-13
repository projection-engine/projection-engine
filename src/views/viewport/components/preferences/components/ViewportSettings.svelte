<script>
    import Accordion from "../../../../../components/accordion/Accordion.svelte";
    import Checkbox from "../../../../../components/checkbox/Checkbox.svelte";
    import ColorPicker from "shared-resources/frontend/components/color-picker/ColorPicker.svelte";
    import Range from "shared-resources/frontend/components/range/Range.svelte";

    export let settings
    export let update
    export let translate

</script>
<Accordion title={translate("RESOLUTION")}>
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
</Accordion>


<Accordion title={translate("BACKGROUND")}>
    <Checkbox
            checked={settings.background}
            handleCheck={() => {
                update("background",  !settings.background)
            }}
            label={translate("ENABLED")}
    />
    <ColorPicker
            label={translate("COLOR")}
            value={settings.backgroundColor.map(c => c*255)}
            submit={(color) => {
            update("backgroundColor", Object.values(color).map(c => c/255))
        }}
    />
</Accordion>


<Accordion title={translate("VIEWPORT")}>
    <Checkbox
            checked={settings.gridVisibility}
            handleCheck={() => {
            update("gridVisibility",  !settings.gridVisibility)
        }}
            label={translate("GRID_VISIBILITY")}
    />
    <Checkbox
            checked={settings.iconsVisibility}
            handleCheck={() => {
            update("iconsVisibility",  !settings.iconsVisibility)
        }}
            label={translate("ICON_VISIBILITY")}
    />
</Accordion>

