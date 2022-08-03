<script>
    import getComponentInfo from "./utils/get-component-info";
    import EnglishLocalization from "../../../../libs/EnglishLocalization";
    import Header from "../../../../components/view/components/Header.svelte";
    import Input from "../../../../components/input/Input.svelte";
    import DataStoreController from "../../stores/DataStoreController";
    import {onDestroy} from "svelte";
    import Form from "./views/Form.svelte";
    import Icon from "../../../../components/Icon/Icon.svelte";
    import Components from "./views/Components.svelte";
    import {v4} from "uuid";

    export let hidden = false
    export let switchView
    export let orientation

    let engine = {}
    const unsubscribeEngine = DataStoreController.getEngine(v => engine = v)
    onDestroy(() => unsubscribeEngine())

    let currentTab = "-2"
    $: entity = engine.selectedEntity
    $: tabs = (() => {
        if (entity) {
            const components = Object.keys(entity.components)
            console.log(components)
            if (components[currentTab] === undefined && currentTab > 0) {
                currentTab = components.length - 1
                return []
            }
            return components.map(c => getComponentInfo(c)).filter(c => Object.keys(c).length > 0)
        }
        return []
    })();
    const translate = key => EnglishLocalization.PROJECT.COMPONENT_EDITOR[key]

    let currentEntityName = ''
    $: {
        if (entity)
            currentEntityName = entity.name
        if (!entity)
            currentTab = "-2"
    }


</script>
<Header
        orientation={orientation}
        hidden={hidden}
        switchView={switchView}
        title={translate("TITLE")}
        icon={"category"}
>

    {#if entity}
        <Input
                setSearchString={v => {
                    currentEntityName = v
                    entity.name = v
                    DataStoreController.updateEngine({...engine, changeID: v4()})
                }}
                searchString={currentEntityName}
                placeholder={translate("ENTITY_NAME")}
        />
    {/if}

</Header>
{#if !hidden}
    <div class="content">
        <Components
                translate={translate}
                tabs={tabs}
                engine={engine}
                currentTab={currentTab}
                setCurrentTab={v => {
                    currentTab = v
                    console.log(v)
                }}
        />
        <div class="wrapper">

            <div class="header">
                {#if !tabs[currentTab]}
                    {#if currentTab === "-2"}
                        <Icon>image</Icon>
                        <div data-overflow="-">{translate("RENDERING")}</div>
                    {:else}
                        <Icon>videocam</Icon>
                        <div data-overflow="-">{translate("POST_PROCESSING")}</div>
                    {/if}

                {:else}
                    <Icon>
                        {tabs[currentTab].icon}
                    </Icon>
                    <div data-overflow="-">
                        {tabs[currentTab].label}
                    </div>
                {/if}
            </div>

            <Form
                    removeComponent={(comp) => {
                        currentTab = "-2"
                        delete entity.components[comp]
                        DataStoreController.updateEngine()
                    }}
                    translate={translate}
                    engine={engine}
                    currentTab={currentTab}
            />

        </div>
    </div>
{/if}


<style>
    .content {
        width: 100%;
        height: 100%;
        display: flex;
        max-height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .header {
        display: flex;
        gap: 4px;
        color: var(--pj-color-primary);
        font-size: 0.8rem;
        font-weight: 550;
        align-items: center;

        width: 100%;
        padding: 4px;
        border-bottom: var(--pj-border-primary) 1px solid;
        justify-content: flex-start
    }

    .wrapper {
        width: 100%;
        overflow-x: hidden;
    }
</style>