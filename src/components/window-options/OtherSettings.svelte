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
    import Notification from "./Notification.svelte";
    import ConsoleAPI from "../../../public/engine/lib/utils/ConsoleAPI";
    import Localization from "../../templates/LOCALIZATION_EN";
    import openBottomView from "../../utils/open-bottom-view";
    import DiffuseProbePass from "../../../public/engine/runtime/rendering/DiffuseProbePass";
    import SpecularProbePass from "../../../public/engine/runtime/rendering/SpecularProbePass";
    import ScriptsAPI from "../../../public/engine/lib/rendering/ScriptsAPI";
    import UIAPI from "../../../public/engine/lib/rendering/UIAPI";
    import UndoRedoAPI from "../../lib/utils/UndoRedoAPI";

    export let store
    export let settings
    export let engine
    export let historyChangeType

    let notifications = []
    let hasMessage = false
    let activeNotifications = true
    const ID = v4()
    onMount(() => {
        alert.bindListener(ID, () => {
            notifications = alert.cache
            hasMessage = notifications.length > 0
        })
    })
    onDestroy(() => alert.removeListener(ID))

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
    <button
            class="button" on:click={UndoRedoAPI.undo}
            disabled={engine.executingAnimation}
    >
        <Icon styles="font-size: 1rem">undo</Icon>
        <ToolTip content={Localization.UNDO}/>
    </button>
    <button
            class="button" on:click={UndoRedoAPI.redo}
            disabled={engine.executingAnimation}
    >
        <Icon styles="font-size: 1rem">redo</Icon>
        <ToolTip content={Localization.REDO}/>
    </button>
    <div data-vertdivider="-" style="height: 15px; margin: 0;"></div>
    <button
            class="button" style="max-width: unset; font-size: .7rem; padding: 0 4px;" on:click={updateStructure}
            disabled={engine.executingAnimation}
    >
        <Icon styles="font-size: 1rem">refresh</Icon>
        {Localization.REFRESH_STRUCTURE}
        <ToolTip content={Localization.REFRESH_SCRIPTS_AND_PROBES}/>
    </button>
    <div data-vertdivider="-" style="height: 15px; margin: 0;"></div>
    <Dropdown hideArrow={true} styles="width: 300px" onOpen={_ => hasMessage = false}>
        <button slot="button" class="button">
            {#if hasMessage}
                <small class="dot"></small>
            {/if}
            <Icon styles="font-size: 1rem">notifications</Icon>
            <ToolTip content={Localization.NOTIFICATIONS}/>
        </button>
        <div class="dropdown-container">
            <div class="dropdown-header">
                <div data-inline="-">
                    <button class="button button-small" style="gap: 4px" on:click={() => alert.clearCache()}>
                        <Icon>clear_all</Icon>
                        {Localization.CLEAR}
                        <ToolTip content={Localization.CLEAR}/>
                    </button>
                    <div data-vertdivider="-" style="margin: 0"></div>
                    <button class="button button-small" on:click={_ => openBottomView(VIEWS.CONSOLE)}>
                        <Icon styles="font-size: 1rem;">terminal</Icon>
                        {Localization.OPEN_CONSOLE}
                        <ToolTip content={Localization.OPEN_CONSOLE}/>
                    </button>
                </div>
                <button
                        class="button button-small"
                        on:click={() => {
                            alert.toggleAlerts()
                            activeNotifications = !activeNotifications
                        }}
                >
                    {#if activeNotifications}
                        <Icon>notifications</Icon>
                    {:else}
                        <Icon>notifications_off</Icon>
                    {/if}
                    <ToolTip content={Localization.TOGGLE_NOTIFICATIONS}/>
                </button>
            </div>
            {#if notifications.length === 0}
                <div style="height: 100%; width: 100%; position: relative">
                    <div data-empty="-">
                        <Icon styles="font-size: 75px">notifications</Icon>
                        {Localization.EMPTY}
                    </div>
                </div>
            {:else}
                <VirtualList items={notifications} let:item>
                    <Notification item={item}/>
                </VirtualList>
            {/if}
        </div>
    </Dropdown>
    <div data-vertdivider="-" style="height: 15px; margin: 0"></div>
    <button
            class="button"
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
    <Dropdown styles="height: 30px">
        <button slot="button" class="button" style="max-width: unset; background: transparent"
                disabled={engine.executingAnimation}>
            <Icon>forest</Icon>
            <div data-overflow="-">
                {#if engine.currentLevel}
                    {engine.currentLevel.name}
                {:else}
                    {Localization.DEFAULT_LEVEL}
                {/if}
            </div>
            <ToolTip content={Localization.LEVEL}/>
        </button>
        <button on:click={() => LevelController.loadLevel()} style="max-width: unset; min-height: unset">
            {#if !engine.currentLevel}
                <Icon styles="font-size: .9rem">check</Icon>
            {:else}
                <div style="width: .9rem"></div>
            {/if}
            {Localization.DEFAULT_LEVEL}
        </button>
        <div data-divider="-"></div>
        {#each store.levels as level}
            <button on:click={() => LevelController.loadLevel(level)} style="max-width: unset; min-height: unset">
                {#if engine.currentLevel?.registryID === level.registryID}
                    <Icon styles="font-size: .9rem">check</Icon>
                {:else}
                    <div style="width: .9rem"></div>
                {/if}
                {level.name}
            </button>
        {/each}
    </Dropdown>
</div>

<style>

    .level-selector {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }


    .button {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        gap: 4px;
        color: var(--pj-color-secondary);

        border: none;
        background: transparent;
        padding: 0 2px;
        min-height: 30px;
        max-height: 30px;
        min-width: 30px;
        max-width: 30px;
        white-space: nowrap;
    }

    .button:hover {
        background: var(--pj-border-primary);
    }

    .dropdown-container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 350px;
        background: var(--pj-background-tertiary);
    }

    .dropdown-header {
        background: var(--pj-background-secondary);
        display: flex;
        justify-content: space-between;
        height: 25px;
        border-bottom: var(--pj-border-primary) 1px solid;
    }

    .button-small {
        min-height: 22px !important;
        max-height: 22px !important;
        min-width: 22px !important;
        max-width: unset !important;
    }

    .button:active {
        background: transparent;
        color: var(--pj-accent-color);
        opacity: .9;
    }

    .notification {
        display: flex;
        align-items: center;
        gap: 4px;
        text-transform: capitalize;
        padding: 0 8px;
        font-size: .75rem;
        color: var(--pj-accent-color);
        font-weight: 500;

    }

    .dot {
        position: absolute;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: red;
        top: 4px;
        right: 4px;
        z-index: 100;
    }
</style>