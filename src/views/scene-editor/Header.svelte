<script>
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import ShadingOption from "../../components/shading-option/ShadingOption.svelte";
    import ViewOptions from "./components/ViewOptions.svelte";
    import AddOptions from "./components/AddOptions.svelte";
    import GizmoSettings from "./components/GizmoSettings.svelte";
    import Localization from "../../templates/LOCALIZATION_EN";

    import EntityStateController from "../../lib/controllers/EntityStateController";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte"
    import CameraSettings from "../preferences/components/CameraSettings.svelte";
    import ObjectOptions from "./components/ObjectOptions.svelte";
    import SpawnSettings from "./components/SpawnSettings.svelte";

    export let settings
    export let engine


</script>


<div class="left-content">
    <button on:click={() => EntityStateController.startPlayState()}>
        <Icon styles="font-size: .85rem">play_arrow</Icon>
        {Localization.PLAY}
    </button>
    <div data-vertdivider="-" style="height: 15px"></div>
    <ViewOptions settings={settings}/>
    <AddOptions/>
    <Dropdown styles="width: 250px">
        <button slot="button" data-viewbutton="-" style="background: transparent;">
            {Localization.CAMERA}
        </button>
        <div style="padding: 8px 4px">
            <CameraSettings/>
        </div>
    </Dropdown>

    <ObjectOptions settings={settings}/>
    <SpawnSettings settings={settings}/>
</div>
<GizmoSettings settings={settings}/>
<div class="right-content">
    <ShadingOption engine={engine} settings={settings}/>
</div>


<style>

    button {
        display: flex;
        align-items: center;
        gap: 4px;


        border: none;
        padding: 0 2px;
        height: 18px;

        white-space: nowrap;
    }

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
        justify-content: flex-end;
        width: 100%;

    }

</style>