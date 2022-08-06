<script>
    import EnglishLocalization from "../../../../libs/EnglishLocalization";
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

    export let hidden = false
    export let switchView
    export let orientation

    let engine = {}
    let store = {}
    const unsubscribeEngine = DataStoreController.getEngine(v => engine = v)
    const unsubscribeStore = FileStoreController.getStore(v => store = v)
    onDestroy(() => {
        unsubscribeEngine()
        unsubscribeStore()
    })

    const translate = key => EnglishLocalization.PROJECT.INSPECTOR[key]
</script>
<Header
        orientation={orientation}
        hidden={hidden}
        switchView={switchView}
        title={translate("TITLE")}
        icon={"category"}
>
    {#if engine.selectedEntity != null}

        <Input
                width="100%"
                setSearchString={v => {
                engine.selectedEntity.name = v
                DataStoreController.updateEngine({...engine, changeID: v4()})
            }}
                searchString={engine.selectedEntity.name}
                placeholder={translate("ENTITY_NAME")}
        />
        <Dropdown hideArrow={true} disabled={store.components.length === 0}>
            <button slot="button" class="button" disabled={store.components.length === 0}>
                <Icon>add</Icon>
                <ToolTip content={translate("LINK_COMPONENT")}/>
            </button>
            {#each store.components as script}
                <button on:click={async () => componentConstructor(engine.selectedEntity, script.registryID).catch()}>
                    {script.name}
                </button>
            {/each}
        </Dropdown>

    {/if}
</Header>
{#if !hidden}
    <div class="content">
        {#if engine.selectedEntity != null}
            <Components

                    translate={translate}
                    engine={engine}
            />
        {/if}
    </div>
{/if}


<style>


    .button {
        padding: 0 !important;
        width: 23px;
        height: 23px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 3px;
    }

    .content {
        width: 100%;
        height: 100%;
        display: grid;

        max-height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>