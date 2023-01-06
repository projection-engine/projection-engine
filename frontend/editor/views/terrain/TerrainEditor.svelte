<script>
    import CameraBar from "../scene-editor/components/CameraGizmo.svelte";
    import TERRAIN_TOOLS from "../../static/TERRAIN_TOOLS.ts";
    import SculptOptions from "./SculptOptions.svelte";
    import FoliageOptions from "./FoliageOptions.svelte";

    import LOCALIZATION_EN from "../../static/LOCALIZATION_EN";
    import RegistryAPI from "../../lib/fs/RegistryAPI";
    import FilesAPI from "../../lib/fs/FilesAPI";
    import Header from "./Header.svelte";
    import SettingsStore from "../../stores/SettingsStore";
    import {onDestroy} from "svelte";
    import ViewHeader from "../../../components/view/components/ViewHeader.svelte";
    import EngineStore from "../../stores/EngineStore";
    import ResizableBar from "../../../components/resizable/ResizableBar.svelte";
    import Icon from "../../../components/icon/Icon.svelte";
    import FS from "../../../lib/FS/FS";

    let settings = {}
    let engine = {}
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    onDestroy(() => {
        unsubscribeSettings()
        unsubscribeEngine()
    })

    let selectedTerrain
    $: {
        if (settings.selectedTerrain != null) {
            const reg = RegistryAPI.getRegistryEntry(settings.selectedTerrain)
            if (reg != null)
                FilesAPI.readFile(FS.ASSETS_PATH + reg.path, "json")
                    .then(file => {
                        if (!file)
                            return
                        selectedTerrain = file
                    })
        }
    }
    let hidden = false
</script>

<ViewHeader>
    <Header settings={settings} engine={engine}/>
</ViewHeader>
{#if !hidden && selectedTerrain != null}
    <div class="wrapper">
        <div class="content">
            {#if settings.terrainTool === TERRAIN_TOOLS.SCULPT}
                <div class="header">
                    <Icon styles="font-size: 1.2rem">carpenter</Icon>
                    {LOCALIZATION_EN.SCULPT_TOOL}
                </div>
                <SculptOptions settings={settings} selectedTerrain={selectedTerrain}/>
            {:else if settings.terrainTool === TERRAIN_TOOLS.FOLIAGE}
                <div class="header">
                    <Icon styles="font-size: 1.2rem">grass</Icon>
                    {LOCALIZATION_EN.FOLIAGE_TOOL}
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