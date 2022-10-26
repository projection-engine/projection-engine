<script>
    import "../viewport/css/styles.css"
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import Localization from "../../templates/LOCALIZATION_EN";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import TERRAIN_TOOLS from "../../data/TERRAIN_TOOLS";
    import SettingsStore from "../../stores/SettingsStore";
    import Selector from "../../components/selector/Selector.svelte";
    import ShadingOption from "../../components/ShadingOption.svelte";

    export let settings

</script>

<div class="button-group viewport">
    <button on:click={() => SettingsStore.updateStore({...settings, terrainTool: TERRAIN_TOOLS.SCULPT})}
            class="button viewport" data-highlight={settings.terrainTool === TERRAIN_TOOLS.SCULPT ? "-" : ""}>
        <Icon styles="font-size: .9rem">carpenter</Icon>
        <ToolTip content={Localization.SCULPT}/>
    </button>
    <button on:click={() => SettingsStore.updateStore({...settings, terrainTool: TERRAIN_TOOLS.PAINT})}
            class="button viewport" data-highlight={settings.terrainTool === TERRAIN_TOOLS.PAINT ? "-" : ""}>
        <Icon styles="font-size: .9rem">brush</Icon>
        <ToolTip content={Localization.PAINT_LAYERS}/>
    </button>
    <button on:click={() => SettingsStore.updateStore({...settings, terrainTool: TERRAIN_TOOLS.FOLIAGE})}
            class="button viewport" data-highlight={settings.terrainTool === TERRAIN_TOOLS.FOLIAGE ? "-" : ""}>
        <Icon styles="font-size: .9rem">grass</Icon>
        <ToolTip content={Localization.PAINT_FOLIAGE}/>
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
    <ShadingOption/>
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