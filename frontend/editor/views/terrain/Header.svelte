<script>
    import LOCALIZATION_EN from "../../static/LOCALIZATION_EN";
    import TERRAIN_TOOLS from "../../static/TERRAIN_TOOLS.ts";
    import SettingsStore from "../../stores/SettingsStore";
    import Selector from "../../../components/selector/Selector.svelte";
    import ShadingOption from "../scene-editor/components/ShadingModels.svelte";
    import ToolTip from "../../../components/tooltip/ToolTip.svelte";
    import Icon from "../../../components/icon/Icon.svelte";

    export let engine
    export let settings

</script>

<div class="button-group viewport">
    <button on:click={() => SettingsStore.updateStore({...settings, terrainTool: TERRAIN_TOOLS.SCULPT})}
            class="button viewport" data-highlight={settings.terrainTool === TERRAIN_TOOLS.SCULPT ? "-" : ""}>
        <Icon styles="font-size: .9rem">carpenter</Icon>
        <ToolTip content={LOCALIZATION_EN.SCULPT}/>
    </button>
    <button on:click={() => SettingsStore.updateStore({...settings, terrainTool: TERRAIN_TOOLS.PAINT})}
            class="button viewport" data-highlight={settings.terrainTool === TERRAIN_TOOLS.PAINT ? "-" : ""}>
        <Icon styles="font-size: .9rem">brush</Icon>
        <ToolTip content={LOCALIZATION_EN.PAINT_LAYERS}/>
    </button>
    <button on:click={() => SettingsStore.updateStore({...settings, terrainTool: TERRAIN_TOOLS.FOLIAGE})}
            class="button viewport" data-highlight={settings.terrainTool === TERRAIN_TOOLS.FOLIAGE ? "-" : ""}>
        <Icon styles="font-size: .9rem">grass</Icon>
        <ToolTip content={LOCALIZATION_EN.PAINT_FOLIAGE}/>
    </button>
</div>

<div class="right-content">
    <Selector
            styles="width: clamp(100px, 15vw, 300px)"
            type="terrain"
            selected={settings.selectedTerrain}
            handleChange={v => {
                SettingsStore.updateStore({...settings,selectedTerrain: v.registryID })
            }}
    />
    <ShadingOption engine={engine} settings={settings}/>
</div>

<style>

    .right-content {
        gap: 4px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 100%;
    }

</style>