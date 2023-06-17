<script>
    import ShadingOption from "./components/ShadingModels.svelte"

    import AddOptions from "./components/AddOptions.svelte"

    import ObjectOptions from "./components/ObjectOptions.svelte"
    import SpawnSettings from "./components/SpawnSettings.svelte"
    import SettingsStore from "../../../shared/stores/SettingsStore"
    import OptionDropdown from "../../../shared/components/dropdown/OptionDropdown.svelte"
    import LocalizationEN from "../../../../shared/LocalizationEN"

    export let settings

    $: OPTIONS = [
    	{
    		label: LocalizationEN.GRID,
    		icon: settings.showGrid ? "check" : undefined,
    		onClick: () => SettingsStore.updateStore({...settings, showGrid: !settings.showGrid})
    	},
    	{
    		label: LocalizationEN.ICONS,
    		icon: settings.showIcons ? "check" : undefined,
    		onClick: () => SettingsStore.updateStore({...settings, showIcons: !settings.showIcons})
    	},
    	{
    		label: LocalizationEN.LINES,
    		icon: settings.showLines ? "check" : undefined,
    		onClick: () => SettingsStore.updateStore({...settings, showLines: !settings.showLines})
    	},
    	{
    		label: LocalizationEN.OUTLINE,
    		icon: settings.showOutline ? "check" : undefined,
    		onClick: () => SettingsStore.updateStore({...settings, showOutline: !settings.showOutline})
    	},
    ]
</script>

<div class="left-content">
    <AddOptions/>
    <ObjectOptions settings={settings}/>
    <SpawnSettings settings={settings}/>
</div>

<div class="right-content">
    <OptionDropdown
            noPadding={true}
            options={OPTIONS}
            label="layers"
            labelAsIcon={true}
            tooltip={LocalizationEN.OVERLAY}
    />


    <ShadingOption settings={settings}/>
</div>


<style>

    .left-content {
        display: flex;
        align-items: center;
        gap: 4px;
        justify-content: flex-start;
        width: 100%;
    }

    .right-content {
        display: flex;
        align-items: center;
        gap: 4px;
        justify-content: flex-end;
        width: 100%;

    }

</style>