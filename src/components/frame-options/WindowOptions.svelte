<script>
    import EngineStore from "../../stores/EngineStore";
    import {onDestroy} from "svelte";
    import LOCALIZATION_EN from "../../templates/LOCALIZATION_EN";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import FilesStore from "../../stores/FilesStore";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import LevelController from "../../lib/utils/LevelController";
    import FRAME_OPTIONS from "../../templates/FRAME_OPTIONS";
    import SettingsStore from "../../stores/SettingsStore";
    import Tabs from "../tabs/Tabs.svelte";
    import VIEWS from "../view/static/VIEWS";
    import CreationController from "./components/CreationController.svelte";
    import OtherSettings from "./GlobalOptions.svelte";
    import VIEWPORT_TABS from "../../static/VIEWPORT_TABS";

    let engine
    let store
    let settings
    let historyChangeType = null
    const unsubscribe = FilesStore.getStore(v => store = v)
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)

    onDestroy(() => {
        unsubscribeEngine()
        unsubscribe()
        unsubscribeSettings()
    })

    const addNewTab = () => {
        const views = [
            ...SettingsStore.data.views,
            {
                name: LOCALIZATION_EN.NEW_TAB + SettingsStore.data.views.length,
                bottom: [[VIEWS.FILES]],
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
    <button disabled={engine.executingAnimation} on:click={_ => LevelController.save()}>
        <Icon>save</Icon>
        <ToolTip content={LOCALIZATION_EN.SAVE}/>
    </button>
    <Dropdown hideArrow="true">
        <button slot="button">
            <Icon>menu</Icon>
            <ToolTip content={LOCALIZATION_EN.OPTIONS}/>
        </button>
        {#each FRAME_OPTIONS as subOption}
            {#if subOption.type !== "separator" }
                <button
                        on:click={e => {
                             window.frameOptionsCallback(subOption.id)
                             e.currentTarget.closeDropdown?.()
                        }}
                        style="padding-left: 25px; max-width: unset; min-height: unset"
                >
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