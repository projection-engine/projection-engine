<script>
    import FormTabs from "./components/FormTabs.svelte"
    import Icon from "../../../../components/Icon/Icon.svelte";
    import getComponentInfo from "./utils/get-component-info";
    import EnglishLocalization from "../../../../static/EnglishLocalization";
    import Header from "../../../../components/view/components/Header.svelte";
    import Input from "../../../../components/input/Input.svelte";

    const DELAY = 250

    export let hidden = false
    export let switchView
    export let orientation

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
    }

    let timeout
    const handleNameChange = (value) => {
        currentEntityName = value
        engine.selectedEntity.name = value
        clearTimeout(timeout)
        setTimeout(() => {

            engine.updateHierarchy()
        }, DELAY)
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
                setSearchString={v => handleNameChange(v)}
                searchString={currentEntityName}
                placeholder={translate("ENTITY_NAME")}
        />
    {/if}
</Header>
{#if !hidden}
    <div class={content}>
        <FormTabs
                translate={translate}
                tabs={tabs}
                entity={engine.selectedEntity}
                currentTab={currentTab}
                setCurrentTab={v => currentTab = v}
        />
        <div style={{width: "100%", overflowX: "hidden"}}>
            {#if !engine.executingAnimation && !currentForm.open}
                <div class={header} style={{justifyContent: "flex-start"}}>
                    <Icon>
                        {currentTab === "-2" ? "image" : null}
                        {currentTab === "-3" ? "videocam" : null}
                    </Icon>
                    <div class={overflow}>
                        {currentTab === "-2" ? translate("RENDERING") : null}
                        {currentTab === "-3" ? translate("POST_PROCESSING") : null}
                    </div>
                </div>
            {/if}
            {#if tabs[currentTab]}
                <div class={header} style={{justifyContent: "flex-start"}}>
                    <Icon>
                        {tabs[currentTab].icon}
                    </Icon>
                    <label class={overflow}>
                        {tabs[currentTab].label}
                    </label>
                </div>
            {/if}
            {currentForm.content}

        </div>
    </div>
{/if}

