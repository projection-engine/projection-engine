<script>
    import EngineStore from "../../../shared/stores/EngineStore"
    import {onDestroy} from "svelte"

    import LevelService from "../../services/engine/LevelService"
    import SettingsStore from "../../../shared/stores/SettingsStore"
    import Tabs from "../tabs/Tabs.svelte"
    import CreationController from "./components/CreationController.svelte"
    import ToolTip from "../../../shared/components/tooltip/ToolTip.svelte"
    import Icon from "../../../shared/components/icon/Icon.svelte"
    import OptionDropdown from "../../../shared/components/dropdown/OptionDropdown.svelte"
    import ChangesTrackerStore from "../../../shared/stores/ChangesTrackerStore"
    import ExecutionService from "../../services/engine/ExecutionService"
    import FrameWrapper from "../../../shared/components/frame/FrameWrapper.svelte"
    import ElectronResources from "../../../shared/lib/ElectronResources"
    import LocalizationEN from "../../../../shared/LocalizationEN"
    import IPCRoutes from "../../../../shared/IPCRoutes"
    import WindowTypes from "../../../../shared/WindowTypes"
    import ViewportUtil from "../../util/ViewportUtil"
    import WindowFrameUtil from "../../util/WindowFrameUtil";


    let engine
    let settings
    let hasChanges = false
    const unsubscribeTracker = ChangesTrackerStore.getStore(v => hasChanges = v)
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)


    onDestroy(() => {
    	unsubscribeTracker()
    	unsubscribeEngine()
    	unsubscribeSettings()
    })

    $: options = WindowFrameUtil.getFrameOptions(engine.executingAnimation || !hasChanges)
</script>

<FrameWrapper>
    <div data-sveltevertdivider="-" style="height: 15px;"></div>
    <div class="wrapper footer-header" style="height: 22px">
        <button
                data-sveltebuttondefault="-"
                disabled={engine.executingAnimation || !hasChanges}
                on:click={_ => LevelService.getInstance().save()}
        >
            <Icon styles="font-size: 1rem">save</Icon>
            <ToolTip content={LocalizationEN.SAVE}/>
        </button>
        <OptionDropdown
                buttonStyles="background: none;"
                cleanLayout={true}
                options={options}
                label="menu"
                autoClose={true}
                labelAsIcon={true}
                tooltip={LocalizationEN.OPTIONS}
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
                disabled={engine.executingAnimation}
                on:click={_ => ElectronResources.ipcRenderer.send(IPCRoutes.OPEN_WINDOW,  {windowSettings: {heightScale: .75, widthScale: 1/3}, type: WindowTypes.PREFERENCES})}
        >
            <Icon styles="font-size: 1rem">settings</Icon>
            <ToolTip content={LocalizationEN.OPEN_PREFERENCES}/>
        </button>
    </div>
</FrameWrapper>
<div data-svelteinline="-" style="padding: 0 2px; border-bottom: var(--pj-border-primary) 1px solid">
    <div class="wrapper footer-header" style="height: 22px">
        <button
                data-sveltebuttondefault="-"
                disabled={engine.executingAnimation}
                on:click={() => ExecutionService.startPlayState()}
                data-svelteview-header-button="-"
                style="color: var(--pj-accent-color)"
        >
            <Icon>play_arrow</Icon>
            <ToolTip content={LocalizationEN.PLAY}/>
        </button>
        <button
                data-sveltebuttondefault="-"
                disabled={!engine.executingAnimation}
                on:click={() => ExecutionService.stopPlayState()}
                data-svelteview-header-button="-"
                style="--pj-accent-color: red; color: var(--pj-accent-color)"
        >
            <Icon>stop</Icon>
            <ToolTip content={LocalizationEN.STOP}/>
        </button>
    </div>

    <div data-sveltevertdivider="-" style="height: 15px;"></div>
    <Tabs
            removeMultipleTabs={() => {
                const currentView = settings.views[settings.currentView]
                SettingsStore.updateStore({...settings, views: [currentView]})
            }}
            allowRenaming={true}
            addNewTab={ViewportUtil.addNewTab}
            removeTab={ViewportUtil.removeTab}
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