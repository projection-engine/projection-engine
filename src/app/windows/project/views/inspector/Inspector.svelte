<script>
    import Localization from "../../../../libs/Localization";
    import Header from "../../../../components/view/components/Header.svelte";
    import EngineStore from "../../stores/EngineStore";
    import {onDestroy} from "svelte";
    import Components from "./views/Components.svelte";
    import Icon from "../../../../components/icon/Icon.svelte";
    import UIStore from "../../stores/UIStore";
    import UIElement from "./views/UIElement.svelte";
    import Entity from "../../libs/engine/production/templates/Entity";
    import EntityElement from "./components/EntityElement.svelte";
    import ComponentLayout from "./components/ComponentLayout.svelte";
    import SelectionStore from "../../stores/SelectionStore";
    import RendererController from "../../libs/engine/production/controllers/RendererController";

    export let hidden = undefined
    export let switchView = undefined
    export let orientation = undefined

    let engine = {}
    let ui = {}
    let parent
    let savedState = false
    let engineSelectedEntity

    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeUI = UIStore.getStore(v => ui = v)
    const unsubscribeSelection = SelectionStore.getStore(() => {
        if (SelectionStore.engineSelected[0])
            engineSelectedEntity = RendererController.entitiesMap.get(SelectionStore.engineSelected[0])
        else
            engineSelectedEntity = RendererController.entitiesMap.get(SelectionStore.lockedEntity)
    })
    onDestroy(() => {
        unsubscribeSelection()
        unsubscribeEngine()
        unsubscribeUI()
    })

    const translate = key => Localization.PROJECT.INSPECTOR[key]
    let focusOnEngineEntities = true
    $: entity = ui.selectedEntity && (!focusOnEngineEntities || !engineSelectedEntity) ? ui.selectedEntity : engineSelectedEntity

    const submitComponent = (key, value, save) => {
        if (!savedState) {
            EngineStore.saveEntity(
                engineSelectedEntity.id,
                undefined,
                key,
                value
            )
            savedState = true
        }
        entity[key] = value
        if (save)
            EngineStore.saveEntity(
                engineSelectedEntity.id,
                undefined,
                key,
                value
            )
    }
</script>
<Header
        orientation={orientation}
        hidden={hidden}
        switchView={switchView}
        title={translate("TITLE")}
        icon={"category"}
/>
{#if !hidden}
    <div class="content">
        {#if entity != null}
            <div class="wrapper-content">
                <EntityElement entity={entity} translate={translate}/>
                {#if !(entity instanceof Entity)}
                    <UIElement
                            component={entity}
                            translate={translate}
                            store={ui}
                    />
                {/if}
                <ComponentLayout
                        key="TRANSFORMATION"
                        translate={translate}
                        component={entity}
                        submit={submitComponent}
                />
                <Components
                        translate={translate}
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