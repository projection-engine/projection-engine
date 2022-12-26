<script>
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import ViewHeader from "../../../components/view/components/ViewHeader.svelte";
    import {onDestroy} from "svelte";
    import SelectionStore from "../../stores/SelectionStore";
    import FilesStore from "../../stores/FilesStore";
    import ContentBrowserItem from "./components/content-browser/ContentBrowserItem.svelte";
    import Entity from "../../../../engine-core/instances/Entity";
    import QueryAPI from "../../../../engine-core/lib/utils/QueryAPI";
    import EntityInspector from "./components/engine/EntityInspector.svelte";
    import AddComponent from "./components/engine/AddComponent.svelte";
    import ShaderNode from "../shader-editor/libs/ShaderNode";
    import AttributeEditor from "./components/shader-editor/AttributeEditor.svelte";
    import {v4} from "uuid";
    import Icon from "../../../components/icon/Icon.svelte";

    const internalID = v4()
    let ui = {}
    let parent

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
                    targetType = LOCALIZATION_EN.CONTENT_BROWSER
                    break
                case T.SHADER_EDITOR:
                    if (v.array[0] instanceof ShaderNode) {
                        targetInstance = v.array[0]
                        targetType = LOCALIZATION_EN.SHADER_EDITOR
                    }
                    break
                case T.ENGINE:
                    targetInstance = QueryAPI.getEntityByID(v.array[0])
                    targetType = LOCALIZATION_EN.ENGINE
                    break
                default:
                    targetInstance = undefined
                    break
            }
        }

        if (!targetInstance && v.lockedEntity != null) {
            targetInstance = QueryAPI.getEntityByID(v.lockedEntity)
            targetType = LOCALIZATION_EN.ENGINE
        }
        entity = targetInstance
    })

    onDestroy(() => unsubscribeSelection())
</script>
{#if entity == null}
    <div data-empty="-">
        <Icon styles="font-size: 75px">category</Icon>
        {LOCALIZATION_EN.INSPECTOR}
    </div>
{:else}
    <ViewHeader>
        {#if entity instanceof Entity}
            <small data-overflow="-" style="font-size: .7rem">{entity.name}</small>
            <AddComponent entity={entity}/>
        {:else}
            <small data-overflow="-" style="font-size: .7rem" id={entity.id+ "-inspector-label-" + internalID}>{entity.name}</small>
        {/if}
    </ViewHeader>
    <div class="content">
        {#if entity instanceof Entity}
            <EntityInspector entity={entity}/>
        {:else if target === SelectionStore.TYPES.CONTENT_BROWSER}
            <ContentBrowserItem item={entity}/>
        {:else if target === SelectionStore.TYPES.SHADER_EDITOR}
            <AttributeEditor node={entity} internalID={internalID}/>
        {/if}
    </div>
{/if}


<style>

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