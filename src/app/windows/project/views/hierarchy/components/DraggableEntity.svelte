<script>
    import dragDrop from "../../../../../components/drag-drop/drag-drop";
    import {onDestroy, onMount} from "svelte";
    import {v4} from "uuid";
    import EngineStore from "../../../stores/EngineStore";
    import Icon from "../../../../../components/icon/Icon.svelte";
    import getEngineIcon from "../utils/get-engine-icon";
    import Entity from "../../../libs/engine/production/templates/Entity";
    import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../../stores/templates/dispatch-renderer-entities";
    import RendererController from "../../../libs/engine/production/controllers/RendererController";
    import SelectionStore from "../../../stores/SelectionStore";
    import Localization from "../../../../../libs/Localization";
    import ToolTip from "../../../../../components/tooltip/ToolTip.svelte";

    export let node
    export let lockedEntity
    export let setLockedEntity
    export let hiddenActiveChildren
    export let setOpen
    export let open

    let ref
    let newName

    $: newName = node.name
    $: icon = getEngineIcon(node)
    const draggable = dragDrop(true)
    onMount(() => {

        draggable.onMount({
            targetElement: ref,
            onDragStart: () => node,
            onDrop: (entityDragged, event) => {
                if (event.ctrlKey) {

                    if (entityDragged.parent)
                        entityDragged.parent.children = entityDragged.parent.children.filter(c => c !== entityDragged)
                    entityDragged.parent = node
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
            dragImage: `<div style="display: flex; gap: 4px"><span style="font-size: .9rem;" data-icon="-">${icon}</span> ${newName}</div>`,
            onDragOver: (data) => {
                if (data instanceof Entity)
                    return `CTRL to parent | SHIFT to clone`
                return `<span style="font-size: .9rem;" data-icon="-">clear</span> Invalid entity`
            }
        })
    })
    onDestroy(() => draggable.onDestroy())
    $: console.log(hiddenActiveChildren)
</script>
<div class="info hierarchy-branch" bind:this={ref}>
    <button
            data-locked={lockedEntity === node.id ? "-" : ""}
            class="buttonIcon hierarchy-branch"
            style={icon === "inventory_2" && lockedEntity !== node.id ?   "color: var(--folder-color)" : undefined}
            on:click={() => setLockedEntity(node.id)}
    >
        <Icon>{icon}</Icon>
    </button>
    {newName}

    {#if hiddenActiveChildren != null}
        <div class="children">
            {#each hiddenActiveChildren as entity, i}
                {#if i < 2}
                    {#if entity === lockedEntity}
                        <button
                                data-locked={"-"}
                                class="buttonIcon hierarchy-branch"
                                on:click={() => {
                            const newOpen = {...open}
                            let current = RendererController.entitiesMap.get(entity)
                            while(current){
                                newOpen[current.id] = true
                                current = current?.parent
                            }
                            SelectionStore.engineSelected = [entity]
                            setOpen(newOpen)
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