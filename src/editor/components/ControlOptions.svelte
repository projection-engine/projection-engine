<script>
    import EngineStore from "../stores/EngineStore";
    import {onDestroy} from "svelte";
    import Localization from "../../shared/libs/Localization";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import FilesStore from "../stores/FilesStore";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import LevelController from "../libs/LevelController";
    import FRAME_OPTIONS from "../templates/FRAME_OPTIONS";
    import SettingsStore from "../stores/SettingsStore";
    import Tabs from "../../shared/components/Tabs.svelte";
    import VIEWS from "../../shared/components/view/data/VIEWS";

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
    <button style="padding: 0 8px;" on:click={_ => LevelController.save()}>
        <Icon styles="font-size: .9rem">save</Icon>
        {translate("SAVE")}
    </button>
    <div data-vertdivider="-" style="height: 15px"></div>
    {#each FRAME_OPTIONS as option}
        <Dropdown hideArrow="true">
            <button slot="button" style="background: transparent; padding: 0 8px;">
                {option.label}
            </button>
            {#each option.submenu as subOption}
                {#if subOption.type === "separator"}
                    <div data-divider="-"></div>
                {:else}
                    <button
                            on:click={e => {
                                 window.frameOptionsCallback(subOption.id)
                                 e.currentTarget.closeDropdown?.()
                            }}
                            style="padding-left: 30px">
                        {subOption.label}
                    </button>
                {/if}
            {/each}
        </Dropdown>
    {/each}

    <div data-vertdivider="-" style="height: 15px"></div>
    <Tabs
            addNewTab={addNewTab}
            removeTab={removeTab}
            tabs={settings.views}
            currentTab={settings.currentView}
            setCurrentView={v => SettingsStore.updateStore({...settings, currentView: v})}
    />
    <div class="level-selector">
        <Dropdown asButton={true} buttonStyles="border-radius: 3px; min-height: 20px;max-height: 20px; background: var(--pj-background-primary)">
            <button slot="button" class="dropdown" style="background: transparent">
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
            <button on:click={() => LevelController.loadLevel()}>
                {#if !engine.currentLevel}
                    <Icon styles="font-size: .9rem">check</Icon>
                {:else}
                    <div style="width: .9rem"></div>
                {/if}
                {translate("DEFAULT_LEVEL")}
            </button>
            <div data-divider="-"></div>
            {#each store.levels as level}
                <button on:click={() => LevelController.loadLevel(level)}>
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
        height: 18px;
        border-radius: 3px;
        overflow: hidden;
        padding: 0 0 0 4px;
        border: none;
    }

    .container {
        margin-bottom: 3px;
        min-height: 25px;
        max-height: 25px;
        width: 100%;
        background: var(--pj-background-tertiary);
        overflow: hidden;
        display: flex;
        align-items: center;
        gap: 2px;
        padding: 0 2px;
    }

    button {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--pj-color-secondary);

        border: none;
        background: transparent;
        padding: 0 2px;
        height: 18px;

        white-space: nowrap;
    }

    button:hover {
        background: var(--pj-border-primary);
    }

    button:active {
        background: transparent;
        opacity: .9;
    }
</style>