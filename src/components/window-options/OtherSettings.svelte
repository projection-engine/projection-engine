<script>
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import SettingsStore from "../../stores/SettingsStore";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import LevelController from "../../lib/utils/LevelController";
    import VIEWS from "../view/static/VIEWS";
    import TabsStore from "../../stores/TabsStore";
    import {onDestroy, onMount} from "svelte";
    import {v4} from "uuid";
    import VirtualList from "@sveltejs/svelte-virtual-list"
    import Notification from "./NotificationItem.svelte";
    import Localization from "../../templates/LOCALIZATION_EN";
    import openBottomView from "../../utils/open-bottom-view";
    import DiffuseProbePass from "../../../public/engine/runtime/rendering/DiffuseProbePass";
    import SpecularProbePass from "../../../public/engine/runtime/rendering/SpecularProbePass";
    import ScriptsAPI from "../../../public/engine/lib/rendering/ScriptsAPI";
    import UIAPI from "../../../public/engine/lib/rendering/UIAPI";
    import UndoRedoAPI from "../../lib/utils/UndoRedoAPI";
    import AlertHistory from "./NotificationHistory.svelte";
    import LevelSelector from "./LevelSelector.svelte";
    import ActionHistory from "./ActionHistory.svelte";

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
    <button
            class="button frame"
            on:click={_ => {
                    const views = [...settings.views]
                    if(views[settings.currentView].viewport[TabsStore.getValue("viewport")] === VIEWS.PREFERENCES)
                        return
                    const vp = views[settings.currentView].viewport.filter(e => e !== VIEWS.PREFERENCES)
                    vp.push(VIEWS.PREFERENCES)
                    views[settings.currentView].viewport = vp
                    SettingsStore.updateStore({...settings, views})
                    TabsStore.update("viewport", undefined, views[settings.currentView].viewport.length - 1)
                }}
    >
        <Icon styles="font-size: 1rem">settings</Icon>
        <ToolTip content={Localization.SHOW_PREFERENCES}/>
    </button>

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