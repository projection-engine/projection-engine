<script>
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import SettingsStore from "../../stores/SettingsStore";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import LevelController from "../../libs/LevelController";
    import VIEWS from "../view/data/VIEWS";
    import TabsStore from "../../stores/TabsStore";
    import {onDestroy, onMount} from "svelte";
    import {v4} from "uuid";
    import VirtualList from "@sveltejs/svelte-virtual-list"
    import Notification from "./Notification.svelte";
    import ConsoleAPI from "../../../public/engine/lib/apis/ConsoleAPI";

    export let store
    export let settings
    export let engine
    export let translate
    export let historyChangeType

    let notifications = []
    let hasMessage = false
    let activeNotifications = true
    const ID = v4()
    onMount(() => {
        let timeout
        alert.bindListener(ID, () => {
            notifications = alert.cache
        })
        ConsoleAPI.initialize(() => {
            hasMessage = true
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                hasMessage = false
            }, 3500)
        })
    })
    onDestroy(() => {
        alert.removeListener(ID)
    })

    function openConsole() {
        const views = [...settings.views]
        const tab = views[settings.currentView]
        if (tab.bottom.length > 0)
            tab.bottom[0].push(VIEWS.CONSOLE)
        else
            tab.bottom[0] = [VIEWS.CONSOLE]

        SettingsStore.updateStore({...settings, views})
        TabsStore.update("bottom", 0, tab.bottom[0].length - 1)
    }
</script>

<div class="level-selector">
    {#if historyChangeType != null}
        <div class="notification">
            <Icon styles="font-size: 1rem">
                {#if historyChangeType === "UNDO"}
                    undo
                {:else}
                    redo
                {/if}
            </Icon>
            <div>
                {#if historyChangeType === "UNDO"}
                    {translate("UNDOING")}
                {:else}
                    {translate("REDOING")}
                {/if}
            </div>
        </div>
        <div data-vertdivider="-" style="height: 15px; margin: 0;"></div>
    {/if}
    <button class="button console" on:click={openConsole}>
        <Icon styles={"font-size: 1rem; " + (hasMessage ? "color: darkorange" : "color: #999")}>feedback</Icon>
        {#if hasMessage}
            <small>{translate("NEW_MESSAGE")}</small>
        {/if}
        <ToolTip content={translate("OPEN_CONSOLE")}/>
    </button>
    <div data-vertdivider="-" style="height: 15px; margin: 0;"></div>
    <Dropdown hideArrow={true} styles="width: 300px">
        <button
                slot="button"
                class="button"
        >
            <Icon styles="font-size: 1rem">notifications</Icon>
            <ToolTip content={translate("NOTIFICATIONS")}/>
        </button>
        <div class="dropdown-container">
            <div class="dropdown-header">
                <button class="button button-small" style="gap: 4px" on:click={() => alert.clearCache()}>
                    <Icon>clear_all</Icon>
                    {translate("CLEAR")}
                    <ToolTip content={translate("CLEAR")}/>
                </button>
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
                    <ToolTip content={translate("TOGGLE_NOTIFICATIONS")}/>
                </button>
            </div>
            {#if notifications.length === 0}
                <div style="height: 100%; width: 100%; position: relative">
                    <div data-empty="-">
                        <Icon styles="font-size: 75px">notifications</Icon>
                        {translate("EMPTY")}
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
        <ToolTip content={translate("SHOW_PREFERENCES")}/>
    </button>

    <div data-vertdivider="-" style="height: 15px; margin: 0"></div>
    <Dropdown styles="height: 25px">
        <button slot="button" class="dropdown">
            <Icon>forest</Icon>
            <div data-overflow="-">
                {#if engine.currentLevel}
                    {engine.currentLevel.name}
                {:else}
                    {translate("DEFAULT_LEVEL")}
                {/if}
            </div>
            <ToolTip content={translate("LEVEL")}/>
        </button>
        <button on:click={() => LevelController.loadLevel()} style="max-width: unset; min-height: unset">
            {#if !engine.currentLevel}
                <Icon styles="font-size: .9rem">check</Icon>
            {:else}
                <div style="width: .9rem"></div>
            {/if}
            {translate("DEFAULT_LEVEL")}
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

    .console {
        min-width: 22px !important;
        max-width: unset !important;
        padding-right: 6px;
        display: flex;
        align-items: center;
        gap: 2px;
        font-size: .73rem;
        color: var(--pj-color-quinary);
    }

    .level-selector {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    .dropdown {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.7rem;
        padding: 0 0 0 4px;
        max-width: unset;
        border: none;
    }

    .button {
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
</style>