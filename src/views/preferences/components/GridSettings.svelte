<script>
    import Range from "shared-resources/frontend/components/range/Range.svelte";
    import Localization from "../../../libs/Localization";
    import CameraAPI from "../../../../public/engine/lib/apis/CameraAPI";
    import CameraTracker from "../../../../public/engine/editor/libs/CameraTracker";
    import SettingsStore from "../../../stores/SettingsStore";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import Checkbox from "../../../components/checkbox/Checkbox.svelte";
    import GridSystem from "../../../../public/engine/editor/services/GridSystem";

    export let settings


    const translate = (key) => Localization.PROJECT.VIEWPORT[key]

</script>


<fieldset>
    <div class="content">
        <Checkbox
                checked={settings.gridVisibility}
                handleCheck={() => SettingsStore.updateStore({...settings, gridVisibility: !settings.gridVisibility })}
                label={translate("ENABLED")}
        />
        <Checkbox
                checked={settings.showGridSubdivision}
                handleCheck={() => SettingsStore.updateStore({...settings, showGridSubdivision: !settings.showGridSubdivision })}
                label={translate("SUB_DIVISION")}
        />
        <Range
                minLabelWidth={"30px"}
                minValue={.001}
                label={translate("BRIGHTNESS")}
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



<style>
    legend{
        font-size: .8rem;
    }
    .content{
        padding-left: 25%;
        display: grid;
        gap: 4px;
    }
</style>
