<script>

    import {onDestroy, onMount} from "svelte"
    import SelectionStore from "../../../stores/SelectionStore"
    import ContentBrowserItem from "./components/content-browser/ContentBrowserItem.svelte"
    import Entity from "../../../../engine-core/instances/Entity"
    import QueryAPI from "../../../../engine-core/lib/utils/QueryAPI"
    import EntityInspector from "./components/engine/EntityAttributes.svelte"

    import Icon from "../../../shared/components/icon/Icon.svelte"
    import ToolTip from "../../../shared/components/tooltip/ToolTip.svelte"
    import PREFERENCES from "../../../preferences/static/PREFERENCES"
    import CameraPreferences from "./components/engine/CameraPreferences.svelte"
    import ContentWrapper from "../../../preferences/components/content/ContentWrapper.svelte"
    import LocalizationEN from "../../../../shared/LocalizationEN"
    import SelectionTargets from "../../../../shared/SelectionTargets"
    import EngineStore from "../../../stores/EngineStore"
    import InspectorUtil from "../../util/InspectorUtil"

    const COMPONENT_ID = crypto.randomUUID()
    const PREFERENCES_TABS = [
    	PREFERENCES[2],
    	PREFERENCES[3],
    	{type: "camera", icon: "camera", label: LocalizationEN.EDITOR_CAMERA},
    	{divider: true}
    ]
    let selectedItem
    let tabIndex
    let tabs = []
    let lockedEntity
    let isEntity
    let isOnDynamicTab


    onMount(() => {
    	SelectionStore.getInstance().addListener(COMPONENT_ID, data => selectedItem = InspectorUtil.getSelectionTarget(data))
    	EngineStore.getInstance().addListener(COMPONENT_ID, data => {
    		lockedEntity = data.lockedEntity ? QueryAPI.getEntityByID(data.lockedEntity) : undefined
    	}, ["lockedEntity"])
    })

    onDestroy(() => {
    	EngineStore.getInstance().removeListener(COMPONENT_ID)
    	SelectionStore.getInstance().removeListener(COMPONENT_ID)
    })

    function setTabs(data) {
    	const TABS = PREFERENCES_TABS.map((e, i) => {
    		if (e.divider)
    			return e
    		return {...e, index: i - 5}
    	})
    	if (!selectedItem)
    		TABS.pop()
    	tabs = [...TABS, ...data]
    }
    $: {
    	if (!selectedItem)
    		selectedItem = lockedEntity
    	if (!selectedItem) {
    		setTabs([])
    	}
    	tabIndex = SelectionTargets.ENGINE === SelectionStore.getData().TARGET ? -1 : -2
    	isOnDynamicTab = tabIndex >= -2 && selectedItem !== undefined
    	isEntity = selectedItem instanceof Entity
    }
</script>

<div class="wrapper">
    <div class="tabs">
        {#each tabs as button}
            {#if button.divider}
                <div data-sveltedivider="-"></div>
            {:else}
                <button data-sveltebuttondefault="-"
                        data-sveltehighlight={tabIndex === button.index ? "-" : undefined}
                        class="tab-button shared"
                        on:click={() => tabIndex = button.index}
                        style={button.color ? "--pj-accent-color: " + button.color  + "; color: " + button.color : undefined}
                >
                    <Icon styles="font-size: .9rem">{button.icon}</Icon>
                    <ToolTip content={button.label}/>
                </button>
            {/if}
        {/each}
    </div>
    <div class="content" style={!isEntity && isOnDynamicTab ? "padding: 4px" : ""}>
        {#if isOnDynamicTab}
            {#if isEntity}
                <EntityInspector
                        setTabIndex={i => tabIndex = i}
                        setTabs={setTabs}
                        entity={selectedItem}
                        tabIndex={tabIndex}/>
            {:else}
                <ContentBrowserItem setTabs={setTabs} item={selectedItem} tabIndex={tabIndex}/>
            {/if}
        {:else}
            {#if tabs[tabIndex + 5]?.type === "camera"}
                <CameraPreferences/>
            {:else}
                <ContentWrapper tab={tabIndex + 7}/>
            {/if}
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