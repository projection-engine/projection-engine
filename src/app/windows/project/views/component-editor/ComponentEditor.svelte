<script>
    import getComponentInfo from "./utils/get-component-info";
    import EnglishLocalization from "../../../../static/EnglishLocalization";
    import Header from "../../../../components/view/components/Header.svelte";
    import Input from "../../../../components/input/Input.svelte";
    import DataStoreController from "../../stores/DataStoreController";
    import {onDestroy} from "svelte";
    import Form from "./views/Form.svelte";
    import Icon from "../../../../components/Icon/Icon.svelte";
    import Components from "./views/Components.svelte";

    console.log("ON COMP EDITOR")

    export let hidden = false
    export let switchView
    export let orientation

    let engine = {}
    const unsubscribeEngine = DataStoreController.getEngine(v => engine = v)
    onDestroy(() => unsubscribeEngine())

    let currentTab = "-2"
    $: tabs = (() => {
        if (engine.selectedEntity) {
            const components = Object.keys(engine.selectedEntity.components)
            if (components[currentTab] === undefined && currentTab > 0) {
                currentTab = components.length - 1
                return []
            }
            return components.map(c => getComponentInfo(c)).filter(c => Object.keys(c).length > 0)
        }
        return []
    })();
    const translate = key => EnglishLocalization.PROJECT.COMPONENT_EDITOR[key]

    let currentEntityName = engine.selectedEntity?.name
    $: {
        if (engine.selectedEntity)
            currentEntityName = (engine.selectedEntity.name)
        else
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

    {#if engine.selectedEntity}
        <Input
                setSearchString={v => {
                currentEntityName = v
                engine.selectedEntity.name = v
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
            {#if !engine.executingAnimation }
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
            {/if}
            <Form
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