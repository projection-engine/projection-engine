<script>

    import {onDestroy, onMount} from "svelte"
    import EntitySelectionStore from "../../../shared/stores/EntitySelectionStore"
    import QueryAPI from "../../../../engine/core/lib/utils/QueryAPI"
    import EntityInspector from "./components/EntityAttributes.svelte"

    import Icon from "../../../shared/components/icon/Icon.svelte"
    import ToolTip from "../../../shared/components/tooltip/ToolTip.svelte"
    import CameraPreferences from "./components/CameraPreferences.svelte"
    import ContentWrapper from "../../../preferences/components/content/ContentWrapper.svelte"
    import InspectorUtil from "../../util/InspectorUtil"
    import INSPECTOR_TABS from "./static/INSPECTOR_TABS"
    import SerializedState from "../../components/view/SerializedState.svelte";

    const COMPONENT_ID = crypto.randomUUID()
    let selectedEntity
    let tabIndex = 0
    let tabs = []
    let isOnDynamicTab = false

    onMount(() => {
        EntitySelectionStore.getInstance().addListener(COMPONENT_ID, data => {
            const temp = QueryAPI.getEntityByID(data.array[0] || data.lockedEntity)
            if (temp === selectedEntity)
                return
            selectedEntity = temp
            tabIndex = INSPECTOR_TABS.length
            if (selectedEntity) {
                const entityTabs = InspectorUtil.getEntityTabs(selectedEntity.allComponents, selectedEntity.isCollection)
                setTabs(entityTabs)
            } else
                setTabs([])
        }, ["array", "lockedEntity"])
    })

    onDestroy(() => {
        EntitySelectionStore.getInstance().removeListener(COMPONENT_ID)
    })

    function setTabs(data) {
        const TABS = [...INSPECTOR_TABS]
        if (!selectedEntity)
            TABS.pop()
        tabs = [...TABS, ...data]
    }

    $: isOnDynamicTab = tabIndex > 2 && selectedEntity !== undefined
</script>

<SerializedState state={{tabIndex}} onStateInitialize={state => tabIndex = state.tabIndex}/>
<div class="wrapper">
    <div class="tabs">
        {#each tabs as button, index}
            {#if button.divider}
                <div data-sveltedivider="-"></div>
            {:else}
                <button data-sveltebuttondefault="-"
                        data-sveltehighlight={tabIndex === index ? "-" : undefined}
                        class="tab-button shared"
                        on:click={() => tabIndex = index}
                        style={button.color ? "--pj-accent-color: " + button.color  + "; color: " + button.color : undefined}
                >
                    <Icon styles="font-size: .9rem">{button.icon}</Icon>
                    <ToolTip content={button.label}/>
                </button>
            {/if}
        {/each}
    </div>
    <div class="content">
        {#if isOnDynamicTab && selectedEntity != null}
            <EntityInspector
                    setTabIndex={i => tabIndex = i}
                    entity={selectedEntity}
                    tabIndex={tabIndex}
            />
        {:else if tabIndex === 2}
            <CameraPreferences/>
        {:else}
            <ContentWrapper data={tabs[tabIndex]}/>
        {/if}
    </div>
</div>


<style>
    .wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        padding: 0 2px;
        gap: 3px;
        max-height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .tabs {
        height: 100%;

        display: grid;
        align-content: flex-start;
        justify-content: center;
        gap: 2px;

        overflow-x: hidden;
        min-width: 25px;
        width: 25px;
        overflow-y: auto;
    }

    .content {
        background: var(--pj-background-tertiary);
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-items: flex-start;
        overflow-y: auto;
        overflow-x: hidden;

        align-content: flex-start;
        gap: 4px;
        padding: 4px 4px 25%;
    }

</style>
