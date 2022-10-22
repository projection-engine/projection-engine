<script>
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import ShadingOption from "../../components/ShadingOption.svelte";
    import ViewOptions from "./components/ViewOptions.svelte";
    import AddOptions from "./components/AddOptions.svelte";
    import GizmoSettings from "./components/GizmoSettings.svelte";
    import Localization from "../../libs/Localization";
    import EngineStore from "../../stores/EngineStore";
    import EntityStateController from "../../libs/EntityStateController";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte"
    import CameraSettings from "../preferences/components/CameraSettings.svelte";
    import ObjectOptions from "./components/ObjectOptions.svelte";
    import DiffuseProbePass from "../../../public/engine/lib/passes/rendering/DiffuseProbePass";
    import SpecularProbePass from "../../../public/engine/lib/passes/rendering/SpecularProbePass";

    export let settings
    export let engine
    const translate = (key) => Localization.PROJECT.VIEWPORT[key]

</script>

<div class="left-content">
    <button on:click={() => {
        if(!EngineStore.engine.executingAnimation)
            EntityStateController.startPlayState()
        else
            EntityStateController.stopPlayState()
    }}>
        <Icon styles="font-size: .85rem">play_arrow</Icon>
        {#if engine.executingAnimation}
            {translate("STOP")}
        {:else}
            {translate("PLAY")}
        {/if}
    </button>

    <button on:click={() => {
        alert.pushAlert(translate("BUILDING_PROBES"), "info")
        DiffuseProbePass.compile()
        SpecularProbePass.compile()
    }}>
        <Icon styles="font-size: .85rem">refresh</Icon>
        {translate("BUILD_PROBES")}
    </button>

    <div data-vertdivider="-" style="height: 15px"></div>
    <ViewOptions settings={settings}/>
    <AddOptions/>
    <Dropdown styles="width: 250px">
        <button slot="button" data-viewbutton="-" style="background: transparent;">
            {translate("CAMERA")}
        </button>
        <div style="padding: 8px 4px">
            <CameraSettings/>
        </div>
    </Dropdown>

    <ObjectOptions settings={settings}/>
</div>
<GizmoSettings settings={settings}/>
<div class="right-content">
    <ShadingOption/>
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