<script>
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import Localization from "../../templates/LOCALIZATION_EN";
    import DiffuseProbePass from "../../../public/engine/runtime/rendering/DiffuseProbePass";
    import SpecularProbePass from "../../../public/engine/runtime/rendering/SpecularProbePass";
    import ScriptsAPI from "../../../public/engine/lib/rendering/ScriptsAPI";
    import UIAPI from "../../../public/engine/lib/rendering/UIAPI";
    import AlertHistory from "./components/NotificationHistory.svelte";
    import LevelSelector from "./components/LevelSelector.svelte";
    import ActionHistory from "./components/ActionHistory.svelte";

    export let store
    export let settings
    export let engine
    export let historyChangeType

    async function updateStructure() {
        alert.pushAlert(Localization.UPDATING_STRUCTURE, "info")
        DiffuseProbePass.compile()
        SpecularProbePass.compile()
        await ScriptsAPI.updateAllScripts()
        await UIAPI.updateAllElements()

        alert.pushAlert(Localization.DONE, "success")
    }
</script>

<div class="level-selector">
    <ActionHistory engine={engine}/>
    <div data-vertdivider="-" style="height: 15px; margin: 0;"></div>
    <button
            class="button frame" style="max-width: unset; font-size: .7rem; padding: 0 4px;" on:click={updateStructure}
            disabled={engine.executingAnimation}
    >
        <Icon styles="font-size: 1rem">refresh</Icon>
        {Localization.REFRESH_STRUCTURE}
        <ToolTip content={Localization.REFRESH_SCRIPTS_AND_PROBES}/>
    </button>
    <div data-vertdivider="-" style="height: 15px; margin: 0;"></div>
    <AlertHistory engine={engine}/>
    <div data-vertdivider="-" style="height: 15px; margin: 0"></div>
    <LevelSelector store={store} engine={engine}/>
</div>

<style>

    .level-selector {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

</style>