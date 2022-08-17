<script>
    import Localization from "../../../../libs/Localization";
    import Header from "../../../../components/view/components/Header.svelte";
    import RendererStoreController from "../../stores/RendererStoreController";
    import {onDestroy} from "svelte";
    import Components from "./views/Components.svelte";
    import Icon from "../../../../components/Icon/Icon.svelte";
    import UIStoreController from "../../stores/UIStoreController";
    import UIElement from "./views/UIElement.svelte";
    import Dropdown from "../../../../components/dropdown/Dropdown.svelte";
    import Entity from "../../libs/engine/templates/basic/Entity";
    import EntityElement from "./components/EntityElement.svelte";

    export let hidden = undefined
    export let switchView = undefined
    export let orientation = undefined

    let engine = {}
    let ui = {}
    let parent
    const unsubscribeEngine = RendererStoreController.getEngine(v => engine = v)
    const unsubscribeUI = UIStoreController.getStore(v => ui = v)
    onDestroy(() => {
        unsubscribeEngine()
        unsubscribeUI()
    })

    const translate = key => Localization.PROJECT.INSPECTOR[key]
    let focusOnEngineEntities = true
    $: entity = ui.selectedEntity && (!focusOnEngineEntities || !engine.selectedEntity) ? ui.selectedEntity : engine.selectedEntity
</script>
<Header
        orientation={orientation}
        hidden={hidden}
        switchView={switchView}
        title={translate("TITLE")}
        icon={"category"}
>
    {#if entity != null}
        <div data-vertdivider="-"></div>
        <div style="font-size: .7rem" data-overflow="-">
            {#if entity instanceof Entity}
                {translate("EDITING_ENTITY")}
            {:else}
                {translate("EDITING_ELEMENT")}
            {/if}
        </div>
        <div data-vertdivider="-"></div>
        <button
                class="toggle-button"
                on:click={() => focusOnEngineEntities = !focusOnEngineEntities}
        >
            {#if focusOnEngineEntities}
                <Icon>account_tree</Icon>
                <div data-overflow="-">
                    {translate("FOCUSED_ON_ENGINE")}
                </div>
            {:else}
                <Icon>grid_view</Icon>
                <div data-overflow="-">
                    {translate("FOCUSED_ON_UI")}
                </div>
            {/if}
        </button>


    {/if}
</Header>
{#if !hidden}
    <div class="content">
        {#if entity != null}
            <div class="wrapper-content">
                <EntityElement entity={entity} translate={translate}/>
                {#if !(entity instanceof Entity)}
                    <UIElement
                            selected={entity}
                            translate={translate}
                            store={ui}
                    />
                {/if}
                <Components
                        translate={translate}
                        engine={engine}
                        entity={entity}
                />
            </div>
        {:else}
            <div data-empty="-">
                <Icon styles="font-size: 75px">category</Icon>
                {translate("TITLE")}
            </div>
        {/if}
    </div>
{/if}


<style>

    .toggle-button {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .content {
        position: relative;
        width: 100%;
        height: 100%;
        display: grid;

        max-height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }


    .wrapper-content {
        display: grid;
        align-content: flex-start;
        gap: 4px;
        overflow-y: auto;
        max-height: 100%;
        width: 100%;
        max-width: 100%;
        padding: 4px 4px 32px;
        color: var(--pj-color-primary);
        overflow-x: hidden;
        height: 100%;
    }

</style>