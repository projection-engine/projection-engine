<script>
    import Accordion from "../../../components/accordion/Accordion.svelte";
    import Range from "../../../components/range/Range.svelte";
    import Checkbox from "../../../components/checkbox/Checkbox.svelte";
    import ColorPicker from "../../../components/color-picker/ColorPicker.svelte";

    export let settings
    export let update
    export let translate

</script>



<Accordion title={translate("EDITOR")}>
    <Checkbox
            checked={settings.visible.sideBarViewport}
            handleCheck={() => {
            update("visible",  {...settings.visible, sideBarViewport: !settings.visible.sideBarViewport})
        }}
            label={translate("SIDE_BAR")}
    />
    <Checkbox
            checked={settings.visible.metricsViewport}
            handleCheck={() => {
            update("visible",  {...settings.visible, metricsViewport: !settings.visible.metricsViewport})
        }}
            label={translate("METRICS")}
    />
    <Checkbox
            checked={settings.visible.shortcuts}
            handleCheck={() => {
            update("visible",  {...settings.visible, shortcuts: !settings.visible.shortcuts})
        }}
            label={translate("SHORTCUTS")}
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
    <Checkbox
            checked={settings.cameraAnimation}
            handleCheck={() => {
            update("cameraAnimation",  !settings.cameraAnimation)
        }}
            label={translate("CAMERA_ANIMATION")}
    />
    <Range
            label={translate("ICON_SIZE")}
            value={settings.iconSize}
            maxValue={5} minValue={.1}
            onFinish={v => update("iconSize", v)}
    />
</Accordion>