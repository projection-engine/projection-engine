<script>
    import dragDrop from "../../../components/drag-drop/drag-drop";
    import {onDestroy, onMount} from "svelte";
    import {v4} from "uuid";
    import EngineStore from "../../../stores/EngineStore";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import getEngineIcon from "../utils/get-engine-icon";
    import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../../stores/templates/dispatch-renderer-entities";
    import SelectionStore from "../../../stores/SelectionStore";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import updateSelection from "../utils/update-selection";
    import HierarchyController from "../../../libs/HierarchyController";
    import EntityNameController from "../../../libs/EntityNameController";
    import EntityAPI from "../../../../public/engine/lib/apis/EntityAPI";
    import KEYS from "../../../data/KEYS";

    export let node
    export let lockedEntity
    export let setLockedEntity
    export let updateOpen
    export let open

    let isOnEdit = false
    let ref
    let cacheName
    $: cacheName = node.name

    $: icons = getEngineIcon(node)
    const draggable = dragDrop(true)
    $: draggable.disabled = isOnEdit
    onMount(() => {
        draggable.onMount({
            targetElement: ref,
            onDragStart: () => node,
            onDrop: (entityDragged, event) => {
                if (event.ctrlKey) {
                    EntityAPI.linkEntities(entityDragged, node)
                    SelectionStore.engineSelected = [entityDragged.id]
                    EngineStore.updateStore({...EngineStore.engine, changeID: v4()})
                    HierarchyController.updateHierarchy()
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
            on:dblclick={() => isOnEdit = true}
            on:mousedown={(e) => updateSelection(node.id, e.ctrlKey)}
    >
        <input
                disabled={!isOnEdit}
                on:change={e => {
                    cacheName = e.value
                    EntityNameController.renameEntity(cacheName, node)
                }}
                on:blur={ev => {
                    cacheName = ev.currentTarget.value
                    EntityNameController.renameEntity(cacheName, node)
                    isOnEdit = false
                }}
                on:keydown={e => {
                    if(e.code === KEYS.Enter){
                        cacheName = e.target.value
                        EntityNameController.renameEntity(cacheName, node)
                        isOnEdit = false
                    }
                }}
                value={cacheName}
        />

        <ToolTip content={cacheName}/>
        {#each icons as icon}
            <Icon styles="font-size: .9rem; width: .9rem">
                <ToolTip content={icon.label}/>
                {icon.icon}
            </Icon>
        {/each}
    </div>

</div>

<style>
    input {
        padding: 0 2px;
        border-radius: 3px;
        background: none;
        border: none;
        outline: none;
        font-size: .7rem;
        color: var(--pj-color-primary);
        backdrop-filter: brightness(50%);
        height: 23px;
        width: 100%;

    }

    input:disabled {
        backdrop-filter: none;
        color: var(--pj-color-quaternary);
    }

    .node {
        cursor: pointer;
        width: 100%;
        height: 23px;
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