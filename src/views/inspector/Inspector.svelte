<script>
    import Localization from "../../templates/Localization";
    import Header from "../../components/view/components/ViewHeader.svelte";
    import {onDestroy} from "svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import SelectionStore from "../../stores/SelectionStore";
    import FilesStore from "../../stores/FilesStore";
    import ContentBrowserItem from "./components/content-browser/ContentBrowserItem.svelte";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import Entity from "../../../public/engine/lib/instances/Entity";
    import QueryAPI from "../../../public/engine/lib/apis/utils/QueryAPI";
    import VIEWS from "../../components/view/data/VIEWS";
    import ActionHistoryAPI from "../../libs/ActionHistoryAPI";
    import EntityInspector from "./components/engine/EntityInspector.svelte";
    import AddComponent from "./components/engine/AddComponent.svelte";

    export let switchView = undefined
    export let orientation = undefined

    const translate = key => Localization.PROJECT.INSPECTOR[key]


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
                    targetType = translate("CONTENT_BROWSER")
                    break
                case T.SHADER_EDITOR:
                    // TODO
                    break
                case T.ENGINE:
                    targetInstance = QueryAPI.getEntityByID(v.array[0])
                    targetType = translate("ENGINE")
                    break
                default:
                    targetInstance = undefined
                    break
            }
        }

        if (!targetInstance && v.lockedEntity != null) {
            targetInstance = QueryAPI.getEntityByID(v.lockedEntity)
            targetType = translate("ENGINE")
        }
        entity = targetInstance

    })
    onDestroy(() => unsubscribeSelection())

    const submitTransformationChange = (key, value, save) => {
        if (!savedState) {
            ActionHistoryAPI.saveEntity(
                entity.id,
                undefined,
                key,
                value
            )
            savedState = true
        }
        if (key === "pivotPoint")
            entity.__pivotChanged = true
        entity[key] = value
        entity.__changedBuffer[0] = 1
        if (save)
            ActionHistoryAPI.saveEntity(
                entity.id,
                undefined,
                key,
                value
            )
    }
    $: console.trace(entity)
</script>
{#if entity == null || entity != null && target !== SelectionStore.TYPES.CONTENT_BROWSER && target !== SelectionStore.TYPES.ENGINE}
    <div data-empty="-">
        <Icon styles="font-size: 75px">category</Icon>
        {translate("TITLE")}
    </div>
{:else}


    <Header
            currentView={VIEWS.COMPONENT}
            orientation={orientation}
            switchView={switchView}
            title={translate("TITLE")}
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


    .target-type {
        background: var(--pj-background-tertiary);
        padding: 4px;

        border-radius: 3px;
        text-align: right;
        font-size: .65rem;
        color: var(--pj-color-quaternary);
    }
</style>