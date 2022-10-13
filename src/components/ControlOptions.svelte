<script>
    import EngineStore from "../stores/EngineStore";
    import {onDestroy} from "svelte";
    import Localization from "../libs/libs/Localization";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import FilesStore from "../stores/FilesStore";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import LevelController from "../libs/LevelController";
    import FRAME_OPTIONS from "../templates/FRAME_OPTIONS";
    import SettingsStore from "../stores/SettingsStore";
    import Tabs from "./tabs/Tabs.svelte";
    import VIEWS from "./view/data/VIEWS";
    import CreationController from "./CreationController.svelte";
    import VIEWPORT_TABS from "../data/VIEWPORT_TABS";

    let engine
    let store
    let settings

    const unsubscribe = FilesStore.getStore(v => store = v)
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    onDestroy(() => {
        unsubscribeEngine()
        unsubscribe()
        unsubscribeSettings()
    })

    const addNewTab = () => {
        const views = [...settings.views, {
            name: translate("NEW_TAB") + settings.views.length,
            bottom: [[VIEWS.CONSOLE]],
            right: [[VIEWS.HIERARCHY]],
            left: []
        }]
        SettingsStore.updateStore({...settings, views})
    }

    const removeTab = (i) => {
        const obj = {...settings}
        if (i === obj.currentView || i < obj.currentView)
            obj.currentView = obj.currentView === 0 ? 0 : obj.currentView - 1

        obj.views = obj.views.filter((_, index) => i !== index)
        SettingsStore.updateStore(obj)
    }

    const translate = key => Localization.PROJECT.CONTROL[key]
</script>

<div class="container">
    <button on:click={_ => LevelController.save()}>
        <Icon>save</Icon>
        <ToolTip content={translate("SAVE")}/>
    </button>
    <div data-vertdivider="-" style="height: 15px"></div>
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
    <div data-vertdivider="-" style="height: 15px"></div>
    <button
            on:click={_ => {
                const views = [...settings.views]
                views[settings.currentView].viewport.push(VIEWPORT_TABS.PREFERENCES)
                SettingsStore.updateStore({...settings, views})
            }}
    >
        <Icon styles="font-size: 1rem">settings</Icon>
        <ToolTip content={translate("SHOW_PREFERENCES")}/>
    </button>
    <div data-vertdivider="-" style="height: 15px"></div>
    <CreationController/>
    <div data-vertdivider="-" style="height: 15px"></div>
    <Tabs
            allowRenaming={true}
            addNewTab={addNewTab}
            removeTab={removeTab}
            tabs={settings.views}
            currentTab={settings.currentView}
            setCurrentView={v => SettingsStore.updateStore({...settings, currentView: v})}
    />
    <div class="level-selector">
        <Dropdown >
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
                <button on:click={() => LevelController.loadLevel(level)}  style="max-width: unset; min-height: unset">
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
</div>

<style>
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
    }

    .container {
        border-bottom: var(--pj-border-primary) 1px solid;
        min-height: 30px;
        max-height: 30px;
        width: 100%;
        background: var(--pj-background-tertiary);
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