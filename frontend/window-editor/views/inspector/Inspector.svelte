<script>
    import LOCALIZATION_EN from "../../../../static/objects/LOCALIZATION_EN";
    import ViewHeader from "../../components/view/components/ViewHeader.svelte";
    import {onDestroy} from "svelte";
    import SelectionStore from "../../../shared/stores/SelectionStore";
    import FilesStore from "../../../shared/stores/FilesStore";
    import ContentBrowserItem from "./components/content-browser/ContentBrowserItem.svelte";
    import Entity from "../../../../engine-core/instances/Entity";
    import QueryAPI from "../../../../engine-core/lib/utils/QueryAPI";
    import EntityInspector from "./components/engine/EntityAttributes.svelte";
    import AddComponent from "./components/engine/AddComponent.svelte";

    import Icon from "../../../shared/components/icon/Icon.svelte";
    import ToolTip from "../../../shared/components/tooltip/ToolTip.svelte";
    import PREFERENCES from "../../../window-preferences/static/PREFERENCES";
    import CameraPreferences from "./components/engine/CameraPreferences.svelte";
    import ContentWrapper from "../../../window-preferences/components/content/ContentWrapper.svelte";
    import Engine from "../../../../engine-core/Engine";

    const internalID = crypto.randomUUID()
    const PREFERENCES_TABS = [
        PREFERENCES[2],
        PREFERENCES[3],
        {type: "camera", icon: "camera", label: LOCALIZATION_EN.EDITOR_CAMERA},
        {divider: true}
    ]
    let parent

    let selectedItem
    let tabIndex = -1
    let tabs = []
    const unsubscribeSelection = SelectionStore.getStore(v => {

        let targetItem
        if (!v.array[0])
            targetItem = undefined
        else {
            const T = SelectionStore.TYPES
            switch (v.TARGET) {
                case T.CONTENT_BROWSER:
                    targetItem = FilesStore.data.items.find(i => i.id === v.array[0])
                    break
                case T.ENGINE:
                    targetItem = QueryAPI.getEntityByID(v.array[0])
                    break
                default:
                    targetItem = undefined
                    break
            }
        }

        if (!targetItem && v.lockedEntity != null)
            targetItem = QueryAPI.getEntityByID(v.lockedEntity)
        if(!targetItem) {
            setTabs([])
            tabIndex = -5
        }

        if (selectedItem !== targetItem) {
            selectedItem = targetItem
            tabIndex = SelectionStore.TYPES.ENGINE === v.TARGET ? -1 : -2
        }
    })

    onDestroy(() => unsubscribeSelection())

    function setTabs(data) {
        const TABS = PREFERENCES_TABS.map((e, i) => {
            if (e.divider)
                return e
            return {
                ...e,
                index: i - 5
            }
        })
        if(!selectedItem)
            TABS.pop()
        tabs = [...TABS, ...data]
    }

    $: isEntity = selectedItem instanceof Entity
    $: isOnDynamicTab = tabIndex >= -2 && selectedItem !== undefined

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
                        on:click={_ => tabIndex = button.index}
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
            {:else if !isEntity}
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
        display: grid;
        align-items: flex-start;
        overflow-y: auto;
        overflow-x: hidden;

        align-content: flex-start;
        gap: 4px;
        padding: 4px 4px 25%;
    }

</style>