<script>
    import Localization from "../../../../libs/Localization";
    import Header from "../../../../components/view/components/Header.svelte";
    import Input from "../../../../components/input/Input.svelte";
    import DataStoreController from "../../stores/DataStoreController";
    import {onDestroy} from "svelte";
    import Components from "./views/Components.svelte";
    import Dropdown from "../../../../components/dropdown/Dropdown.svelte";
    import Icon from "../../../../components/Icon/Icon.svelte";
    import ToolTip from "../../../../components/tooltip/ToolTip.svelte";
    import FileStoreController from "../../stores/FileStoreController";
    import {v4} from "uuid";
    import componentConstructor from "../../libs/component-constructor";
    import COMPONENTS from "../../libs/engine/data/COMPONENTS";
    import getNativeComponents from "./utils/get-native-components";
    import TransformComponent from "../../libs/engine/libs/components/TransformComponent";
    import Entity from "./components/Entity.svelte";

    export let hidden = undefined
    export let switchView = undefined
    export let orientation = undefined

    let engine = {}
    const unsubscribeEngine = DataStoreController.getEngine(v => engine = v)
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
            <div class="empty">
                <Icon styles="font-size: 75px">category</Icon>
                {translate("TITLE")}
            </div>
        {/if}
    </div>
{/if}


<style>


    .empty {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: grid;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
        width: 100%;
        height: 100%;

        font-size: .8rem;
        color: var(--pj-color-quaternary);
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
</style>