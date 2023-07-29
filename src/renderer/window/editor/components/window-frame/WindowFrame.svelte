<script>
    import EngineStore from "../../../shared/stores/EngineStore"
    import {onDestroy, onMount} from "svelte"

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
    import LocalizationEN from "../../../../../shared/enums/LocalizationEN"
    import IPCRoutes from "../../../../../shared/enums/IPCRoutes"
    import WindowTypes from "../../../../../shared/enums/WindowTypes"
    import ViewportUtil from "../../util/ViewportUtil"
    import WindowFrameUtil from "../../util/WindowFrameUtil"

    const COMPONENT_ID = crypto.randomUUID()

    let executingAnimation = false
    let settings = {}
    let hasChanges = false

    onMount(() => {
        EngineStore.getInstance().addListener(COMPONENT_ID, v => executingAnimation = v.executingAnimation, ["executingAnimation"])
        ChangesTrackerStore.getInstance().addListener(COMPONENT_ID, v => hasChanges = v.changed)
        SettingsStore.getInstance().addListener(COMPONENT_ID, v => settings = v, ["views", "currentView"])
    })

    onDestroy(() => {
        EngineStore.getInstance().removeListener(COMPONENT_ID)
        ChangesTrackerStore.getInstance().removeListener(COMPONENT_ID)
        SettingsStore.getInstance().removeListener(COMPONENT_ID)
    })

    function removeTab(i) {
        let currentView = settings.currentView
        if (i === currentView || i < currentView)
            currentView = currentView === 0 ? 0 : currentView - 1
        const views = settings.views.filter((_, index) => i !== index)
        SettingsStore.updateStore({views, currentView})
    }
</script>

<FrameWrapper>
    <div data-sveltevertdivider="-" style="height: 15px;"></div>
    <div class="wrapper footer-header" style="height: 22px">
        <button
                data-sveltebuttondefault="-"
                disabled={executingAnimation}
                on:click={() => LevelService.getInstance().save()}
        >
            <Icon styles="font-size: 1rem">save</Icon>
            <ToolTip content={LocalizationEN.SAVE}/>
        </button>
        <OptionDropdown
                buttonStyles="background: none;"
                cleanLayout={true}
                options={WindowFrameUtil.getFrameOptions(executingAnimation || !hasChanges)}
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
                disabled={executingAnimation}
                on:click={() => ElectronResources.ipcRenderer.send(IPCRoutes.OPEN_WINDOW,  {windowSettings: {heightScale: .75, widthScale: 1/3}, type: WindowTypes.PREFERENCES})}
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
                disabled={executingAnimation}
                on:click={() => ExecutionService.startPlayState()}
                data-svelteview-header-button="-"
                style="color: var(--pj-accent-color)"
        >
            <Icon>play_arrow</Icon>
            <ToolTip content={LocalizationEN.PLAY}/>
        </button>
        <button
                data-sveltebuttondefault="-"
                disabled={!executingAnimation}
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
                const settingsInstance =  SettingsStore.getInstance()
                const currentView = settingsInstance.data.views[settingsInstance.data.currentView]
               settingsInstance.updateStore({views: [currentView]})
            }}
            allowRenaming={true}
            addNewTab={ViewportUtil.addNewTab}
            removeTab={removeTab}
            tabs={settings.views}
            currentTab={settings.currentView}
            setCurrentView={v => SettingsStore.updateStore({currentView: v})}
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
