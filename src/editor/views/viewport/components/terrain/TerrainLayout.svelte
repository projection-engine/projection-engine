<script>
    import CameraBar from "../shared/CameraBar.svelte";
    import TERRAIN_TOOLS from "../../../../data/TERRAIN_TOOLS";
    import SculptOptions from "./SculptOptions.svelte";
    import FoliageOptions from "./FoliageOptions.svelte";
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import ResizableBar from "../../../../../shared/components/resizable/ResizableBar.svelte";
    import Localization from "../../../../../shared/libs/Localization";
    import RegistryAPI from "../../../../../shared/libs/files/RegistryAPI";
    import FilesAPI from "../../../../../shared/libs/files/FilesAPI";
    import FilesStore from "../../../../stores/FilesStore";

    const translate = key => Localization.PROJECT.VIEWPORT[key]
    export let settings

    let selectedTerrain
    $: {
        if (settings.selectedTerrain != null) {
            RegistryAPI.readRegistryFile(settings.selectedTerrain).then(reg => {
                if(!reg)
                    return
                FilesAPI.readFile(FilesStore.ASSETS_PATH + reg.path, "json")
                    .then(file => {
                        if(!file)
                            return
                        console.log(file)
                        selectedTerrain = file
                    })
            })
        }
    }
    let hidden = false
</script>


{#if !hidden && selectedTerrain != null}
    <div class="wrapper">
        <div class="content">
            {#if settings.terrainTool === TERRAIN_TOOLS.SCULPT}
                <div class="header">
                    <Icon styles="font-size: 1.2rem">carpenter</Icon>
                    {translate("SCULPT_TOOL")}
                </div>
                <SculptOptions settings={settings} selectedTerrain={selectedTerrain}/>
            {:else if settings.terrainTool === TERRAIN_TOOLS.FOLIAGE}
                <div class="header">
                    <Icon styles="font-size: 1.2rem">grass</Icon>
                    {translate("FOLIAGE_TOOL")}
                </div>
                <FoliageOptions settings={settings}/>
            {/if}
        </div>
        <ResizableBar type="width"/>
        <div style="max-width: 0"></div>
    </div>
{/if}

<CameraBar/>

<style>
    .header {
        display: flex;
        align-items: center;
        gap: 6px;
        justify-content: flex-start;
        font-size: .85rem;
        font-weight: 550;
        padding-bottom: 4px;
        width: 100%;
        border-bottom: var(--pj-border-primary) 1px solid;
    }

    .content {

        border-radius: 3px;
        display: grid;
        align-content: flex-start;
        gap: 6px;
        width: 100%;
        padding: 4px;
        backdrop-filter: brightness(50%) blur(10px);
        overflow-x: hidden;
        overflow-y: auto;
    }

    .wrapper {
        min-width: clamp(250px, 10vw, 400px);
        position: absolute;
        top: 2px;
        left: 2px;
        display: flex;


    }
</style>