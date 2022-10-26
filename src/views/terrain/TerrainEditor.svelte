<script>
    import CameraBar from "../../components/CameraGizmo.svelte";
    import TERRAIN_TOOLS from "../../data/TERRAIN_TOOLS";
    import SculptOptions from "./SculptOptions.svelte";
    import FoliageOptions from "./FoliageOptions.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import ResizableBar from "shared-resources/frontend/components/resizable/ResizableBar.svelte";
    import Localization from "../../templates/Localization";
    import RegistryAPI from "../../libs/RegistryAPI";
    import FilesAPI from "../../libs/FilesAPI";
    import NodeFS from "shared-resources/frontend/libs/NodeFS";
    import Header from "./Header.svelte";
    import SettingsStore from "../../stores/SettingsStore";
    import {onDestroy} from "svelte";
    import ViewHeader from "../../components/view/components/ViewHeader.svelte";

    let settings = {}
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    onDestroy(() => unsubscribeSettings())

    let selectedTerrain
    $: {
        if (settings.selectedTerrain != null) {
            RegistryAPI.readRegistryFile(settings.selectedTerrain).then(reg => {
                if (!reg)
                    return
                FilesAPI.readFile(NodeFS.ASSETS_PATH + reg.path, "json")
                    .then(file => {
                        if (!file)
                            return
                        selectedTerrain = file
                    })
            })
        }
    }
    let hidden = false
</script>

<ViewHeader>
    <Header settings={settings}/>
</ViewHeader>
{#if !hidden && selectedTerrain != null}
    <div class="wrapper">
        <div class="content">
            {#if settings.terrainTool === TERRAIN_TOOLS.SCULPT}
                <div class="header">
                    <Icon styles="font-size: 1.2rem">carpenter</Icon>
                    {Localization.SCULPT_TOOL}
                </div>
                <SculptOptions settings={settings} selectedTerrain={selectedTerrain}/>
            {:else if settings.terrainTool === TERRAIN_TOOLS.FOLIAGE}
                <div class="header">
                    <Icon styles="font-size: 1.2rem">grass</Icon>
                    {Localization.FOLIAGE_TOOL}
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
        font-weight: 500;
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
        top: 25px;
        left: 2px;
        display: flex;


    }
</style>