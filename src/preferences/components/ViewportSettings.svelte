<script>
    import Accordion from "../../shared/components/accordion/Accordion.svelte";
    import Checkbox from "../../shared/components/checkbox/Checkbox.svelte";
    import ColorPicker from "../../shared/components/color-picker/ColorPicker.svelte";

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
            checked={settings.visible.metrics}
            handleCheck={() => {
            update("visible",  {...settings.visible, metrics: !settings.visible.metrics})
        }}
            label={translate("METRICS")}
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
</Accordion>