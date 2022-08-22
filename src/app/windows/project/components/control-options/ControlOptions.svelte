<script>
    import RendererStoreController from "../../stores/RendererStoreController";
    import loadScripts from "../../utils/load-scripts";
    import {onDestroy} from "svelte";
    import Layout from "./Layout.svelte";
    import Localization from "../../../../libs/Localization";
    import Dropdown from "../../../../components/dropdown/Dropdown.svelte";
    import Icon from "../../../../components/icon/Icon.svelte";
    import CBStoreController from "../../stores/CBStoreController";
    import ToolTip from "../../../../components/tooltip/ToolTip.svelte";

    let engine
    let store
    const unsubscribe = CBStoreController.getStore(v => store = v)
    const unsubscribeEngine = RendererStoreController.getEngine(v => engine = v)
    onDestroy(() => {
        unsubscribeEngine()
        unsubscribe()
    })

    const translate = key => Localization.PROJECT.CONTROL[key]
</script>

<div class="container">

    <button on:click={() => loadScripts().catch()}>
        <Icon styles="font-size: .85rem">play_arrow</Icon>
        {#if engine.executingAnimation}
            {translate("STOP")}
        {:else}
            {translate("PLAY")}
        {/if}
    </button>
    <button on:click={() => {
        alert.pushAlert(translate("BUILDING_PROBES"), "info")
        window.renderer.refreshProbes()
    }}>
        <Icon styles="font-size: .85rem">refresh</Icon>
        {translate("BUILD_PROBES")}
    </button>
    <div data-vertdivider="-" style="height: 15px"></div>
    <Layout/>
    <div class="level-selector">
        <Dropdown buttonStyles="border-radius: 3px; height: 18px; background: var(--pj-border-primary);">
            <button slot="button" class="dropdown" style="background: transparent">
                <Icon>forest</Icon>
                <div data-overflow="-">
                    {#if engine.currentLevel}
                        {engine.currentLevel.name}
                    {:else}
                        {translate("DEFAULT_LEVEL")}
                    {/if}
                </div>
                <ToolTip>{translate("LEVEL")}</ToolTip>
            </button>
            <button on:click={() => RendererStoreController.loadLevel()}>
                {#if !engine.currentLevel}
                    <Icon>check</Icon>
                {/if}
                {translate("DEFAULT_LEVEL")}
            </button>
            <div data-divider="-"></div>
            {#each store.levels as level}
                <button on:click={() => RendererStoreController.loadLevel(level)}>
                    {#if engine.currentLevel?.registryID === level.registryID}
                        <Icon>check</Icon>
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
        min-height: 25px;
        max-height: 25px;
        width: 100%;
        background: var(--pj-background-quaternary);
        overflow: hidden;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 0 2px;
    }

    button {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--pj-color-tertiary);

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