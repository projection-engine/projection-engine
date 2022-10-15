<script>
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import SettingsStore from "../../stores/SettingsStore";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import LevelController from "../../libs/LevelController";
    import VIEWS from "../view/data/VIEWS";
    import TabsStore from "../../stores/TabsStore";

    export let store
    export let settings
    export let engine
    export let translate
</script>

<div class="level-selector">
    <button on:click={undefined} class="button">
        <Icon styles="font-size: 1rem">notifications</Icon>
        <ToolTip content={translate("NOTIFICATIONS")}/>
    </button>
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

    .button:active {
        background: transparent;
        color: var(--pj-accent-color);
        opacity: .9;
    }
</style>