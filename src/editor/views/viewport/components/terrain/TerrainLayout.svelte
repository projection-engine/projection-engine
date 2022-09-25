<script>
    import CameraBar from "../editor/CameraBar.svelte";
    import TERRAIN_TOOLS from "../../../../data/TERRAIN_TOOLS";
    import SculptOptions from "./SculptOptions.svelte";
    import FoliageOptions from "./FoliageOptions.svelte";
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import ResizableBar from "../../../../../shared/components/resizable/ResizableBar.svelte";
    import Localization from "../../../../../shared/libs/Localization";

    const translate = key => Localization.PROJECT.VIEWPORT[key]
    export let settings
    let hidden = false
</script>


{#if !hidden}
    <div class="wrapper">

        <div class="content">
            {#if settings.terrainTool === TERRAIN_TOOLS.SCULPT}
                <div class="header">
                    <Icon styles="font-size: 1.2rem">carpenter</Icon>
                    {translate("SCULPT_TOOL")}
                </div>
                <SculptOptions settings={settings}/>
            {:else if settings.terrainTool === TERRAIN_TOOLS.FOLIAGE}
                <div class="header">
                    <Icon styles="font-size: 1.2rem">grass</Icon>
                    {translate("FOLIAGE_TOOL")}
                </div>
                <FoliageOptions settings={settings}/>
            {/if}
        </div>
        <ResizableBar type="width"/>
        <div style="max-width: 0px"></div>
    </div>

{/if}

<CameraBar/>

<style>
    .header {
        display: flex;
        align-items: center;
        gap: 6px;
        justify-content: flex-start;
        font-size: 1rem;
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
    }

    .wrapper {
        width: clamp(250px, 10vw, 400px);
        position: absolute;
        top: 2px;
        left: 2px;
        display: flex;
        overflow: auto;

    }
</style>