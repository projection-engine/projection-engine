<script>
    import ResizableBar from "../../../../../shared/components/resizable/ResizableBar.svelte";
    import Range from "../../../../../shared/components/range/Range.svelte";
    import Localization from "../../../../../shared/libs/Localization";
    import SettingsStore from "../../../../stores/SettingsStore";
    import Checkbox from "../../../../../shared/components/checkbox/Checkbox.svelte";
    import Icon from "../../../../../shared/components/icon/Icon.svelte";

    export let settings

    const translate = key => Localization.PROJECT.VIEWPORT[key]
    $: terrainSettings = settings.terrainSettings

    function update(key, value) {
        SettingsStore.updateStore({...settings, terrainSettings: {...settings.terrainSettings, [key]: value}})
    }
</script>


<div class="boxes">
    <Checkbox
            label={translate("LOWER")}
            checked={terrainSettings.brushOnDecrease}
            handleCheck={() => update("brushOnDecrease", true)}/>
    <Checkbox
            label={translate("RAISE")}
            checked={!terrainSettings.brushOnDecrease}
            handleCheck={() => update("brushOnDecrease", false)}/>
</div>
<fieldset>
    <legend>{translate("STROKE")}</legend>
    <Range label={translate("WIDTH")} value={terrainSettings.brushSize} onFinish={v => update("brushSize", v)}/>
    <Range label={translate("STRENGTH")} value={terrainSettings.brushStrength}
           onFinish={v => update("brushStrength", v)}/>
</fieldset>


<style>
    fieldset {
        padding: 0;
    }

    legend {
        margin-bottom: 4px;

    }


    .boxes {
        display: grid;
        gap: 2px;
        padding: 2px;
        border-radius: 3px;
        background: var(--pj-background-secondary);
    }
</style>