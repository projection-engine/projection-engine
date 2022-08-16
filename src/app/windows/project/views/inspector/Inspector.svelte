<script>
    import Localization from "../../../../libs/Localization";
    import Header from "../../../../components/view/components/Header.svelte";
    import RendererStoreController from "../../stores/RendererStoreController";
    import {onDestroy} from "svelte";
    import Components from "./views/Components.svelte";
    import Icon from "../../../../components/Icon/Icon.svelte";
    import UIStoreController from "../../stores/UIStoreController";
    import Entity from "../../libs/engine/templates/basic/Entity";
    import UIElement from "./views/UIElement.svelte";

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
    $: entity = ui.selectedEntity ? ui.selectedEntity : engine.selectedEntity
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
        <div style="font-size: .7rem">
            {translate("VISUALIZING_ENTITY")}
        </div>
    {/if}
</Header>
{#if !hidden}
    <div class="content">
        {#if entity != null}
            <div class="wrapper-content" >
            {#if entity instanceof Entity}
                <Components
                        translate={translate}
                        engine={engine}
                />
            {:else}
                <UIElement
                        selected={entity}
                        translate={translate}
                        store={ui}
                />
            {/if}
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