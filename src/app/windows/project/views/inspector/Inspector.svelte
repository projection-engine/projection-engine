<script>
    import Localization from "../../../../libs/Localization";
    import Header from "../../../../components/view/components/Header.svelte";
    import RendererStoreController from "../../stores/RendererStoreController";
    import {onDestroy} from "svelte";
    import Components from "./views/Components.svelte";
    import Icon from "../../../../components/Icon/Icon.svelte";

    export let hidden = undefined
    export let switchView = undefined
    export let orientation = undefined

    let engine = {}
    const unsubscribeEngine = RendererStoreController.getEngine(v => engine = v)
    onDestroy(() => {
        unsubscribeEngine()
    })


    const translate = key => Localization.PROJECT.INSPECTOR[key]
    $: entity = engine.selectedEntity
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

            <Components
                    translate={translate}
                    engine={engine}
            />
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
</style>