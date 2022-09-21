<script>
    import dragDrop from "../../../../shared/components/drag-drop/drag-drop";
    import {onDestroy, onMount} from "svelte";
    import {v4} from "uuid";
    import EngineStore from "../../../stores/EngineStore";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import getEngineIcon from "../utils/get-engine-icon";
    import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../../stores/templates/dispatch-renderer-entities";
    import SelectionStore from "../../../stores/SelectionStore";
    import Localization from "../../../../shared/libs/Localization";
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte";
    import updateSelection from "../utils/update-selection";
    import QueryAPI from "../../../../../public/engine/production/apis/utils/QueryAPI";
    import {EntityAPI} from "../../../../../public/engine/production";

    export let node
    export let lockedEntity
    export let setLockedEntity
    export let hiddenActiveChildren
    export let updateOpen
    export let open

    let ref

    $: icons = getEngineIcon(node)
    const draggable = dragDrop(true)
    onMount(() => {

        draggable.onMount({
            targetElement: ref,
            onDragStart: () => node,
            onDrop: (entityDragged, event) => {
                if (event.ctrlKey) {
                    EntityAPI.linkEntities(entityDragged, node)
                    node.children.push(entityDragged)
                    const ID = v4()
                    EngineStore.updateStore({...EngineStore.engine, changeID: ID})
                } else if (event.shiftKey) {
                    const clone = entityDragged.clone()
                    clone.parent = node
                    node.children.push(clone)
                    dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: clone})
                }
            },
            dragImage: `<div style="display: flex; gap: 4px"><span style="font-size: .9rem;" data-icon="-">view_in_ar</span> ${node.name}</div>`,
            onDragOver: () => `CTRL to parent | SHIFT to clone`
        })
    })
    onDestroy(() => draggable.onDestroy())
</script>

<div class="info hierarchy-branch">
    <button
            data-locked={lockedEntity === node.id ? "-" : ""}
            class="buttonIcon hierarchy-branch"
            style={lockedEntity === node.id ? undefined : "color: var(--folder-color)"}
            on:click={() => setLockedEntity(node.id)}
    >
        <Icon>view_in_ar</Icon>
    </button>
    <div
            bind:this={ref}
            class="node"
            on:click={(e) => updateSelection(node.id, e.ctrlKey)}
    >
        <div data-overflow="-">
            <ToolTip content={node.name}/>
            {node.name}
        </div>

        {#each icons as icon}
            <Icon styles="font-size: .9rem">
                <ToolTip content={icon.label}/>
                {icon.icon}
            </Icon>
        {/each}
    </div>

    {#if hiddenActiveChildren != null}
        <div class="children">
            {#each hiddenActiveChildren as entity, i}
                {#if i < 2}
                    {#if entity === lockedEntity}
                        <button
                                data-locked={"-"}
                                class="buttonIcon hierarchy-branch"
                                on:click={() => {
                                    let current = QueryAPI.getEntityByID(entity)
                                    while(current){
                                        open.set(current.id, true)
                                        current = current?.parent
                                    }
                                    SelectionStore.engineSelected = [entity]
                                    updateOpen()
                                }}
                        >
                            <Icon styles="font-size: .9rem">lock</Icon>
                            <ToolTip content={Localization.PROJECT.HIERARCHY.FOCUS_LOCKED_ENTITY}/>
                        </button>
                    {:else}
                        <div class="dot">
                            <ToolTip content={Localization.PROJECT.HIERARCHY.SELECTED_CHILD}/>
                        </div>
                    {/if}
                {/if}
            {/each}
        </div>
    {/if}
</div>

<style>
    .node {
        cursor: pointer;
        width: 100%;
        height: 23px;
        line-height: 23px;
        color: var(--pj-color-quaternary);

        display: flex;
        align-items: center;
        gap: 2px;
        overflow: hidden;

        white-space: nowrap;
    }

    .dot {
        width: 5px;
        height: 5px;
        background: var(--pj-accent-color);
        border-radius: 50%;
    }

    .children {
        display: flex;
        gap: 3px;
        align-items: center;
    }
</style>