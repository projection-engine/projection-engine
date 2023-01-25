<script>
    import EngineStore from "../../views/editor/stores/EngineStore";
    import {onDestroy} from "svelte";
    import LOCALIZATION_EN from "../../views/editor/static/LOCALIZATION_EN";
    import FilesStore from "../../views/editor/stores/FilesStore";
    import LevelController from "../../views/editor/lib/utils/LevelController";
    import getFrameOptions from "./utils/get-frame-options";
    import SettingsStore from "../../views/editor/stores/SettingsStore";
    import Tabs from "../tabs/Tabs.svelte";
    import CreationController from "./components/CreationController.svelte";
    import OtherSettings from "./GlobalOptions.svelte";
    import ToolTip from "../tooltip/ToolTip.svelte";
    import Icon from "../icon/Icon.svelte";
    import SingleSelectDropdown from "../dropdown/OptionDropdown.svelte";
    import FALLBACK_VIEW from "../../views/editor/static/FALLBACK_VIEW";
    import ChangesTrackerStore from "../../views/editor/stores/ChangesTrackerStore";


    let engine
    let store
    let settings
    let historyChangeType = null
    let hasChanges = false
    const unsubscribeTracker = ChangesTrackerStore.getStore(v => hasChanges = v)
    const unsubscribe = FilesStore.getStore(v => store = v)
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)


    onDestroy(() => {
        unsubscribeTracker()
        unsubscribeEngine()
        unsubscribe()
        unsubscribeSettings()
    })

    const addNewTab = () => {
        const views = [
            ...SettingsStore.data.views,
            {...FALLBACK_VIEW}
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

    $: options = getFrameOptions(  engine.executingAnimation || !hasChanges)
</script>

<div class="container">
    <button data-sveltebuttondefault="-"  disabled={engine.executingAnimation || !hasChanges}
            on:click={_ => LevelController.save()}>
        <Icon>save</Icon>
        <ToolTip content={LOCALIZATION_EN.SAVE}/>
    </button>
    <SingleSelectDropdown
            cleanLayout={true}
            options={options}
            label="menu"
            autoClose={true}
            labelAsIcon={true}
            tooltip={LOCALIZATION_EN.OPTIONS}
    />

        <div data-sveltevertdivider="-" style="height: 15px; margin: 0"></div>
        <CreationController/>

        <div data-sveltevertdivider="-" style="height: 15px;"></div>
        <Tabs
                removeMultipleTabs={() => {
                const currentView = settings.views[settings.currentView]
                SettingsStore.updateStore({...settings, views: [currentView]})
            }}
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