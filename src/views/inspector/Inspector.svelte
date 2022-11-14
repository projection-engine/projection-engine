<script>
    import Localization from "../../templates/LOCALIZATION_EN";
    import Header from "../../components/view/components/ViewHeader.svelte";
    import {onDestroy} from "svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import SelectionStore from "../../stores/SelectionStore";
    import FilesStore from "../../stores/FilesStore";
    import ContentBrowserItem from "./components/content-browser/ContentBrowserItem.svelte";
    import Entity from "../../../public/engine/instances/Entity";
    import QueryAPI from "../../../public/engine/lib/utils/QueryAPI";
    import VIEWS from "../../components/view/static/VIEWS";
    import EntityInspector from "./components/engine/EntityInspector.svelte";
    import AddComponent from "./components/engine/AddComponent.svelte";

    export let switchView = undefined
    export let orientation = undefined

    let ui = {}
    let parent
    let savedState = false

    let target
    let entity
    let targetType

    const unsubscribeSelection = SelectionStore.getStore(v => {
        target = v.TARGET
        let targetInstance
        if (!v.array[0])
            targetInstance = undefined
        else {
            const T = SelectionStore.TYPES
            switch (v.TARGET) {
                case T.CONTENT_BROWSER:
                    targetInstance = FilesStore.data.items.find(i => i.id === v.array[0])
                    targetType = Localization.CONTENT_BROWSER
                    break
                case T.SHADER_EDITOR:
                    // TODO
                    break
                case T.ENGINE:
                    targetInstance = QueryAPI.getEntityByID(v.array[0])
                    targetType = Localization.ENGINE
                    break
                default:
                    targetInstance = undefined
                    break
            }
        }

        if (!targetInstance && v.lockedEntity != null) {
            targetInstance = QueryAPI.getEntityByID(v.lockedEntity)
            targetType = Localization.ENGINE
        }
        entity = targetInstance

    })
    onDestroy(() => unsubscribeSelection())
</script>
{#if entity == null || entity != null && target !== SelectionStore.TYPES.CONTENT_BROWSER && target !== SelectionStore.TYPES.ENGINE}
    <div data-empty="-">
        <Icon styles="font-size: 75px">category</Icon>
        {Localization.INSPECTOR}
    </div>
{:else}
    <Header
            currentView={VIEWS.COMPONENT}
            orientation={orientation}
            switchView={switchView}
            title={Localization.INSPECTOR}
            icon={"category"}
    >
        <div class="entity-container">
            {#if entity instanceof Entity}
                <small data-overflow="-" style="font-size: .7rem">{entity.name}</small>
                <AddComponent entity={entity}/>
            {:else}
                <small data-overflow="-" style="font-size: .7rem">{entity.name}</small>
            {/if}
        </div>
    </Header>
    <div class="content">
        {#if entity instanceof Entity}
            <EntityInspector entity={entity}/>
        {:else if target === SelectionStore.TYPES.CONTENT_BROWSER}
            <ContentBrowserItem item={entity}/>
        {/if}
    </div>
{/if}


<style>
    .entity-container {
        overflow: hidden;
        display: flex;
        gap: 2px;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 0 3px;
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