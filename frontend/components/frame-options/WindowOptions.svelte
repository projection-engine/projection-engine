<script>
    import EngineStore from "../../editor/stores/EngineStore";
    import {onDestroy} from "svelte";
    import LOCALIZATION_EN from "../../static/LOCALIZATION_EN";
    import FilesStore from "../../editor/stores/FilesStore";
    import LevelController from "../../editor/lib/utils/LevelController";
    import FRAME_OPTIONS from "./utils/get-frame-options";
    import SettingsStore from "../../editor/stores/SettingsStore";
    import Tabs from "../tabs/Tabs.svelte";
    import VIEWS from "../view/static/VIEWS";
    import CreationController from "./components/CreationController.svelte";
    import OtherSettings from "./GlobalOptions.svelte";
    import VIEWPORT_TABS from "../../static/VIEWPORT_TABS.ts";
    import ToolTip from "../tooltip/ToolTip.svelte";
    import Icon from "../icon/Icon.svelte";
    import Dropdown from "../dropdown/Dropdown.svelte";
    import WindowUtils from "../../editor/lib/WindowUtils";
    import SingleSelectDropdown from "../dropdown/OptionDropdown.svelte";
    import getFrameOptions from "./utils/get-frame-options";

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
                viewport: [ VIEWPORT_TABS.EDITOR],
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
    <SingleSelectDropdown
            cleanLayout={true}
            options={getFrameOptions()}
            label="menu"
            autoClose={true}
            labelAsIcon={true}
            tooltip={LOCALIZATION_EN.OPTIONS}
    />
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
    .dropdown-button {
        padding: 0 8px;
        display: flex;
        gap: 4px;
        align-items: center;
        justify-content: flex-start;
        max-width: unset;
        min-height: unset;
    }

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