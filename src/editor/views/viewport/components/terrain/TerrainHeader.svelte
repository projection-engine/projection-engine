<script>
    import "../../css/styles.css"
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import Localization from "../../../../../shared/libs/Localization";
    import ToolTip from "../../../../../shared/components/tooltip/ToolTip.svelte";
    import TERRAIN_TOOLS from "../../../../data/TERRAIN_TOOLS";
    import SettingsStore from "../../../../stores/SettingsStore";

    const translate = key => Localization.PROJECT.VIEWPORT[key]

    export let settings

</script>

<div class="button-group viewport">
    <button on:click={() => SettingsStore.updateStore({...settings, terrainTool: TERRAIN_TOOLS.SCULPT})}
            class="button viewport" data-highlight={settings.terrainTool === TERRAIN_TOOLS.SCULPT ? "-" : ""}>
        <Icon styles="font-size: .9rem">carpenter</Icon>
        <ToolTip content={translate("SCULPT")}/>
    </button>
    <button on:click={() => SettingsStore.updateStore({...settings, terrainTool: TERRAIN_TOOLS.PAINT})}
            class="button viewport" data-highlight={settings.terrainTool === TERRAIN_TOOLS.PAINT ? "-" : ""}>
        <Icon styles="font-size: .9rem">brush</Icon>
        <ToolTip content={translate("PAINT_LAYERS")}/>
    </button>
    <button on:click={() => SettingsStore.updateStore({...settings, terrainTool: TERRAIN_TOOLS.FOLIAGE})}
            class="button viewport" data-highlight={settings.terrainTool === TERRAIN_TOOLS.FOLIAGE ? "-" : ""}>
        <Icon styles="font-size: .9rem">grass</Icon>
        <ToolTip content={translate("PAINT_FOLIAGE")}/>
    </button>
</div>

