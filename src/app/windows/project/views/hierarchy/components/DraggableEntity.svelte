<script>
    import dragDrop from "../../../../../components/drag-drop";
    import {onDestroy, onMount} from "svelte";
    import {v4} from "uuid";
    import RendererStoreController from "../../../stores/RendererStoreController";
    import Icon from "../../../../../components/icon/Icon.svelte";
    import getEngineIcon from "../utils/get-engine-icon";
    import Entity from "../../../libs/engine/production/templates/Entity";
    import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../../stores/templates/dispatch-renderer-entities";
    import EngineHistory from "../../../stores/templates/EngineHistory";

    export let node
    export let lockedEntity
    export let setLockedEntity

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
                    RendererStoreController.updateEngine({...RendererStoreController.engine, changeID: ID})
                } else if(event.shiftKey) {
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
    <div class="label hierarchy-branch">
        {newName}
    </div>
</div>
