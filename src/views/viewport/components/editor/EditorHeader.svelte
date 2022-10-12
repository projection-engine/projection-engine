<script>
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import ShadingOption from "../shared/ShadingOption.svelte";
    import ActiveFeatures from "./ActiveFeatures.svelte";
    import AddEntity from "./AddEntity.svelte";
    import GizmoSettings from "./GizmoSettings.svelte";
    import ViewportActions from "../../../../libs/ViewportActions";
    import SelectionStore from "../../../../stores/SelectionStore";
    import Localization from "../../../../libs/libs/Localization";
    import EngineStore from "../../../../stores/EngineStore";
    import EntityStateController from "../../../../libs/EntityStateController";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte"
    import {DiffuseProbePass, SpecularProbePass} from "../../../../../public/engine/production";

    export let settings
    export let engine
    const translate = (key) => Localization.PROJECT.VIEWPORT[key]

</script>

<div class="left-content">
    <slot name="switch-button"/>

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

    <ActiveFeatures settings={settings}/>
    <Dropdown>
        <button slot="button" data-viewbutton="-" style="background: transparent;">
            {translate("SELECT")}
        </button>

        <button on:click={() => ViewportActions.selectAll()}>
            {translate("ALL")}
        </button>

        <button on:click={() => ViewportActions.invertSelection()}>
            {translate("INVERT")}
        </button>

        <button on:click={() => SelectionStore.engineSelected = []}>
            {translate("NONE")}
        </button>
    </Dropdown>
    <AddEntity/>
</div>
<GizmoSettings settings={settings}/>
<div class="right-content">
    <ShadingOption />
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