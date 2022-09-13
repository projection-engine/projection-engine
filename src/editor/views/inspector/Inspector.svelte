<script>
    import Localization from "../../../shared/libs/Localization";
    import Header from "../../../shared/components/view/components/Header.svelte";
    import EngineStore from "../../stores/EngineStore";
    import {onDestroy} from "svelte";
    import Components from "./components/engine/Components.svelte";
    import Icon from "../../../shared/components/icon/Icon.svelte";
    import UIStore from "../../stores/UIStore";
    import UIElement from "./components/UIElement.svelte";
    import EntityElement from "./components/engine/EntityElement.svelte";
    import ComponentLayout from "./components/engine/ComponentLayout.svelte";
    import SelectionStore from "../../stores/SelectionStore";
    import Engine from "../../../../public/engine/production/Engine";
    import FilesStore from "../../stores/FilesStore";
    import ContentBrowserItem from "./components/content-browser/ContentBrowserItem.svelte";
    import UserInterfaceController from "../../../../public/engine/production/controllers/UserInterfaceController";
    import ToolTip from "../../../shared/components/tooltip/ToolTip.svelte";
    import Entity from "../../../../public/engine/production/instances/entity/Entity";

    export let hidden = undefined
    export let switchView = undefined
    export let orientation = undefined

    let engine = {}
    let ui = {}
    let parent
    let savedState = false
    let selectionStore
    let entity
    let targetType


    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeUI = UIStore.getStore(v => ui = v)
    const unsubscribeSelection = SelectionStore.getStore(v => selectionStore = v)
    onDestroy(() => {
        unsubscribeSelection()
        unsubscribeEngine()
        unsubscribeUI()
    })

    const translate = key => Localization.PROJECT.INSPECTOR[key]

    $: target = selectionStore.TARGET
    $:{
        let targetInstance
        if (!selectionStore.array[0])
            targetInstance = undefined
        else {
            const T = SelectionStore.TYPES
            switch (target) {
                case T.CONTENT_BROWSER:
                    targetInstance = FilesStore.data.items.find(i => i.id === selectionStore.array[0])
                    targetType = translate("CONTENT_BROWSER")
                    break
                case T.SHADER_EDITOR:
                    // TODO
                    break
                case T.ENGINE:
                    targetInstance = Engine.entitiesMap.get(selectionStore.array[0])
                    targetType = translate("ENGINE")
                    break
                case T.UI:
                    targetInstance = UserInterfaceController.entities.get(selectionStore.array[0])
                    targetType = translate("UI")
                    break
                default:
                    targetInstance = undefined
                    break
            }
        }

        if (!targetInstance && SelectionStore.lockedEntity) {
            targetInstance = Engine.entitiesMap.get(SelectionStore.lockedEntity)
            targetType = translate("ENGINE")
        }
        entity = targetInstance
    }

    const submitTransformationChange = (key, value, save) => {
        if (!savedState) {
            EngineStore.saveEntity(
                entity.id,
                undefined,
                key,
                value
            )
            savedState = true
        }
        entity[key] = value
        if (save)
            EngineStore.saveEntity(
                entity.id,
                undefined,
                key,
                value
            )
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
        <div class="entity-container">
            <div data-vertdivider="-"></div>
            <small data-overflow="-" style="font-size: .7rem">{entity.name}</small>

            <small data-overflow="-" class="target-type">
                <ToolTip content={targetType}/>{targetType}</small>
        </div>
    {/if}
</Header>
<div class="content" style={hidden ? "display: none" : undefined}>
    {#if entity != null}
        {#if target === SelectionStore.TYPES.ENGINE || entity instanceof Entity}
            <div class="wrapper-content">
                <EntityElement entity={entity} translate={translate}/>
                {#if entity instanceof UIElement}
                    <UIElement
                            component={entity}
                            translate={translate}
                            store={ui}
                    />
                {:else}
                    <ComponentLayout
                            key="TRANSFORMATION"
                            translate={translate}
                            component={entity}
                            submit={submitTransformationChange}
                    />
                {/if}
                <Components
                        translate={translate}
                        entity={entity}
                />
            </div>
        {:else if target === SelectionStore.TYPES.CONTENT_BROWSER}
            <ContentBrowserItem item={entity}/>
        {/if}


    {:else}
        <div data-empty="-">
            <Icon styles="font-size: 75px">category</Icon>
            {translate("TITLE")}
        </div>
    {/if}
</div>


<style>
    .entity-container {
        overflow: hidden;
        display: flex;
        gap: 2px;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding-right: 2px;
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


    .wrapper-content {
        display: grid;
        align-content: flex-start;
        gap: 4px;
        overflow-y: auto;
        max-height: 100%;
        width: 100%;
        max-width: 100%;
        padding: 4px 4px 32px;
        color: var(--pj-color-primary);
        overflow-x: hidden;
        height: 100%;
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