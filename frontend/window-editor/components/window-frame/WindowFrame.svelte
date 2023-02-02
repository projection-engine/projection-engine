<script>
    import EngineStore from "../../stores/EngineStore";
    import {onDestroy} from "svelte";
    import LOCALIZATION_EN from "../../../shared/static/LOCALIZATION_EN";
    import FilesStore from "../../stores/FilesStore";
    import LevelController from "../../lib/utils/LevelController";
    import getFrameOptions from "./utils/get-frame-options";
    import SettingsStore from "../../stores/SettingsStore";
    import Tabs from "../tabs/Tabs.svelte";
    import CreationController from "./components/CreationController.svelte";
    import ToolTip from "../../../shared/components/tooltip/ToolTip.svelte";
    import Icon from "../../../shared/components/icon/Icon.svelte";
    import OptionDropdown from "../../../shared/components/dropdown/OptionDropdown.svelte";
    import ChangesTrackerStore from "../../stores/ChangesTrackerStore";
    import EntityStateController from "../../lib/controllers/EntityStateController";
    import addNewTab from "../../views/viewport/utils/add-new-tab";
    import removeTab from "./utils/remove-tab";
    import FrameWrapper from "../../../shared/components/frame/FrameWrapper.svelte";
    import LevelSelector from "./components/LevelSelector.svelte";
    import Electron from "../../../shared/lib/Electron";
    import ROUTES from "../../../../backend/static/ROUTES";
    import WindowTypes from "../../../../backend/static/WindowTypes";


    let engine
    let store
    let settings
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

    $: options = getFrameOptions(engine.executingAnimation || !hasChanges)
</script>

<FrameWrapper>
    <div data-sveltevertdivider="-" style="height: 15px;"></div>
    <div class="wrapper footer-header" style="height: 22px">
        <button
                data-sveltebuttondefault="-"
                disabled={engine.executingAnimation || !hasChanges}
                on:click={_ => LevelController.save()}
        >
            <Icon styles="font-size: 1rem">save</Icon>
            <ToolTip content={LOCALIZATION_EN.SAVE}/>
        </button>
        <OptionDropdown
                buttonStyles="background: none;"
                cleanLayout={true}
                options={options}
                label="menu"
                autoClose={true}
                labelAsIcon={true}
                tooltip={LOCALIZATION_EN.OPTIONS}
        />
    </div>
    <div data-sveltevertdivider="-" style="height: 15px;"></div>
    <div class="wrapper footer-header" style="height: 22px">
        <CreationController/>
    </div>
    <div data-sveltevertdivider="-" style="height: 15px;"></div>
    <div class="wrapper footer-header" style="height: 22px">
        <button
                data-sveltebuttondefault="-"
                disabled={engine.executingAnimation || !hasChanges}
                on:click={_ => Electron.ipcRenderer.send(ROUTES.OPEN_WINDOW,  {windowSettings: {heightScale: .75, widthScale: 1/3}, type: WindowTypes.PREFERENCES})}
        >
            <Icon styles="font-size: 1rem">settings</Icon>
            <ToolTip content={LOCALIZATION_EN.OPEN_PREFERENCES}/>
        </button>
    </div>
</FrameWrapper>
<div data-svelteinline="-" style="padding: 0 2px; border-bottom: var(--pj-border-primary) 1px solid">
    <div class="wrapper footer-header" style="height: 22px">
        <button
                data-sveltebuttondefault="-"
                disabled={engine.executingAnimation}
                on:click={() => EntityStateController.startPlayState()}
                data-svelteview-header-button="-"
                style="color: var(--pj-accent-color)"
        >
            <Icon>play_arrow</Icon>
            <ToolTip content={LOCALIZATION_EN.PLAY}/>
        </button>
        <button
                data-sveltebuttondefault="-"
                disabled={!engine.executingAnimation}
                on:click={() => EntityStateController.stopPlayState()}
                data-svelteview-header-button="-"
                style="--pj-accent-color: red; color: var(--pj-accent-color)"
        >
            <Icon>stop</Icon>
            <ToolTip content={LOCALIZATION_EN.STOP}/>
        </button>
    </div>
    <div data-sveltevertdivider="-" style="height: 15px;"></div>
    <div class="wrapper footer-header" style="height: 22px">
        <LevelSelector store={store} engine={engine}/>
    </div>
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
</div>

<style>
    button {
        background: none;
        border: none;

        display: flex;
        align-items: center;
        justify-content: center;
        width: 25px;
        height: 25px;
    }
</style>