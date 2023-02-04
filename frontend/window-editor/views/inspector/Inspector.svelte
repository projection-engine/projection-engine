<script>
    import LOCALIZATION_EN from "../../../shared/static/LOCALIZATION_EN";
    import ViewHeader from "../../components/view/components/ViewHeader.svelte";
    import {onDestroy} from "svelte";
    import SelectionStore from "../../../shared/stores/SelectionStore";
    import FilesStore from "../../../shared/stores/FilesStore";
    import ContentBrowserItem from "./components/content-browser/ContentBrowserItem.svelte";
    import Entity from "../../../../engine-core/instances/Entity";
    import QueryAPI from "../../../../engine-core/lib/utils/QueryAPI";
    import EntityInspector from "./components/engine/EntityInspector.svelte";
    import AddComponent from "./components/engine/AddComponent.svelte";

    import Icon from "../../../shared/components/icon/Icon.svelte";
    import ToolTip from "../../../shared/components/tooltip/ToolTip.svelte";
    import PREFERENCES from "../../../window-preferences/static/PREFERENCES";
    import CameraSettings from "../scene-editor/components/CameraSettings.svelte";
    import CameraPreferences from "./components/engine/CameraPreferences.svelte";
    import ContentWrapper from "../../../window-preferences/components/content/ContentWrapper.svelte";

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
        const target = v.TARGET
        let targetInstance
        if (!v.array[0])
            targetInstance = undefined
        else {
            const T = SelectionStore.TYPES
            switch (v.TARGET) {
                case T.CONTENT_BROWSER:
                    targetInstance = FilesStore.data.items.find(i => i.id === v.array[0])
                    break
                case T.ENGINE:
                    targetInstance = QueryAPI.getEntityByID(v.array[0])
                    break
                default:
                    targetInstance = undefined
                    break
            }
        }

        if (!targetInstance && v.lockedEntity != null)
            targetInstance = QueryAPI.getEntityByID(v.lockedEntity)
        if (selectedItem !== targetInstance) {
            selectedItem = targetInstance
            tabIndex = SelectionStore.TYPES.ENGINE === target ? -1 : -2
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
        tabs = [...TABS, ...data]
    }
$: isEntity = selectedItem instanceof Entity
    $: isOnDynamicTab = tabIndex >= -2
</script>
{#if selectedItem == null}
    <div data-svelteempty="-">
        <Icon styles="font-size: 75px">category</Icon>
        {LOCALIZATION_EN.INSPECTOR}
    </div>
{:else}
    <ViewHeader>
        {#if selectedItem instanceof Entity}
            <div data-svelteinline="-" style="gap: 4px">
                <Icon styles="font-size: .9rem">view_in_ar</Icon>
                <ToolTip content={selectedItem.name}/>
                <small data-svelteoverflow="-" style="font-size: .7rem">{selectedItem.name}</small>
            </div>
            <AddComponent entity={selectedItem}/>

        {:else}
            <small data-svelteoverflow="-" style="font-size: .7rem"
                   id={selectedItem.id+ "-inspector-label-" + internalID}>{selectedItem.name}</small>
        {/if}
    </ViewHeader>
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
                    <EntityInspector setTabIndex={i => tabIndex = i} setTabs={setTabs} entity={selectedItem} tabIndex={tabIndex}/>
                {:else}
                    <ContentBrowserItem setTabs={setTabs} item={selectedItem} tabIndex={tabIndex}/>
                {/if}
            {:else}
                {#if tabs[tabIndex + 5].type === "camera"}
                    <CameraPreferences/>
                {:else}
                    <ContentWrapper tab={tabIndex + 7}/>
                {/if}
            {/if}
        </div>
    </div>
{/if}


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
        background: var(--pj-background-secondary);
        position: relative;
        width: 100%;
        height: 100%;
        display: grid;
        align-items: flex-start;
        overflow-y: auto;
        overflow-x: hidden;

        align-content: flex-start;
        gap: 4px;

        padding-bottom: 25%;
    }

</style>