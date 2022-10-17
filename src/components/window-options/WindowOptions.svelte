<script>
    import EngineStore from "../../stores/EngineStore";
    import {onDestroy, onMount} from "svelte";
    import Localization from "../../libs/Localization";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import FilesStore from "../../stores/FilesStore";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import LevelController from "../../libs/LevelController";
    import FRAME_OPTIONS from "../../templates/FRAME_OPTIONS";
    import SettingsStore from "../../stores/SettingsStore";
    import Tabs from "../tabs/Tabs.svelte";
    import VIEWS from "../view/data/VIEWS";
    import CreationController from "./CreationController.svelte";
    import OtherSettings from "./OtherSettings.svelte";
    import VIEWPORT_TABS from "../../data/VIEWPORT_TABS";
    import ActionHistoryAPI from "../../libs/ActionHistoryAPI";

    let engine
    let store
    let settings
    let historyChangeType = null
    let timeout

    const translate = key => Localization.PROJECT.CONTROL[key]
    const unsubscribe = FilesStore.getStore(v => store = v)
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)

    onMount(() => {
        ActionHistoryAPI.initializeListener(type => {
            historyChangeType = type
            clearTimeout(timeout)
            timeout = setTimeout(() => historyChangeType = null, 2000)
        })
    })
    onDestroy(() => {
        unsubscribeEngine()
        unsubscribe()
        unsubscribeSettings()
    })

    const addNewTab = () => {
        const views = [
            ...SettingsStore.data.views,
            {
                name: translate("NEW_TAB") + SettingsStore.data.views.length,
                bottom: [[VIEWS.CONSOLE]],
                right: [[VIEWS.HIERARCHY]],
                viewport: [VIEWPORT_TABS.EDITOR],
                left: [],
                top: []
            }
        ]
        SettingsStore.updateStore({...settings, views})
    }

    const removeTab = i => {
        const obj = {...settings}
        if (i === obj.currentView || i < obj.currentView)
            obj.currentView = obj.currentView === 0 ? 0 : obj.currentView - 1

        obj.views = obj.views.filter((_, index) => i !== index)
        SettingsStore.updateStore(obj)
    }

</script>

<div class="container">
    <button on:click={_ => LevelController.save()}>
        <Icon>save</Icon>
        <ToolTip content={translate("SAVE")}/>
    </button>
    <Dropdown hideArrow="true">
        <button slot="button">
            <Icon>menu</Icon>
            <ToolTip content={translate("OPTIONS")}/>
        </button>
        {#each FRAME_OPTIONS as subOption}
            {#if subOption.type === "separator" && subOption.label}
                <div data-inline="-" style="padding: 0 4px; margin-top: 4px; gap: 8px">
                    <small style="font-size: .73rem">{subOption.label}</small>
                    <div data-divider="-" style="margin: 0"></div>
                </div>
            {:else}
                <button
                        on:click={e => {
                             window.frameOptionsCallback(subOption.id)
                             e.currentTarget.closeDropdown?.()
                        }}
                        style="padding-left: 30px; max-width: unset; min-height: unset">
                    {subOption.label}
                </button>
            {/if}
        {/each}
    </Dropdown>
    <div data-vertdivider="-" style="height: 15px; margin: 0"></div>
    <CreationController/>
    <div data-vertdivider="-" style="height: 15px;"></div>
    <Tabs
            allowRenaming={true}
            addNewTab={addNewTab}
            removeTab={removeTab}
            tabs={settings.views}
            currentTab={settings.currentView}
            setCurrentView={v => SettingsStore.updateStore({...settings, currentView: v})}
    />
    <OtherSettings
            historyChangeType={historyChangeType}
            store={store}
            settings={settings}
            engine={engine}
            translate={translate}
    />
</div>

<style>


    .container {
        border-bottom: var(--pj-border-primary) 1px solid;
        min-height: 30px;
        max-height: 30px;
        width: 100%;
        overflow: hidden;
        display: flex;
        align-items: center;
        padding: 0 2px;
    }

    button {
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

    button:hover {
        background: var(--pj-border-primary);
    }

    button:active {
        background: transparent;
        color: var(--pj-accent-color);
        opacity: .9;
    }
</style>