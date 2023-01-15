<script lang="ts">
    import dragDrop from "../../../../../components/drag-drop/drag-drop";
    import {onDestroy, onMount} from "svelte";
    import getEngineIcon from "../utils/get-engine-icon";
    import updateSelection from "../utils/update-selection";
    import EntityNameController from "../../../lib/controllers/EntityNameController";
    import KEYS from "../../../static/KEYS.ts";
    import handleDrop from "../utils/handle-drop";
    import UndoRedoAPI from "../../../lib/utils/UndoRedoAPI";
    import ACTION_HISTORY_TARGETS from "../../../static/ACTION_HISTORY_TARGETS.ts";
    import SelectionStore from "../../../stores/SelectionStore";
    import Engine from "../../../../../../engine-core/Engine";
    import ToolTip from "../../../../../components/tooltip/ToolTip.svelte";
    import Icon from "../../../../../components/icon/Icon.svelte";
    import Entity from "../../../../../../engine-core/instances/Entity";

    export let node:Entity
    export let lockedEntity:string

    export let setLockedEntity:Function

    let isOnEdit = false
    let ref:HTMLElement
    let cacheName:string
    $: cacheName = node.name

    $: icons = getEngineIcon(node)
    const draggable = dragDrop(true)
    $: draggable.disabled = isOnEdit

    function getDragTarget(){
        return SelectionStore.engineSelected.length > 0 ? SelectionStore.engineSelected.map(e => Engine.entities.map.get(e)) : node
    }

    onMount(() => {
        draggable.onMount({
            targetElement: ref,
            onDragStart: () => getDragTarget(),
            onDrop: (entityDragged, event) => handleDrop(event, entityDragged, node),
            dragImage: _ => `<div style="display: flex; gap: 4px"><span style="font-size: .9rem;" data-icon="-">view_in_ar</span> ${SelectionStore.engineSelected.length > 1 ? SelectionStore.engineSelected.length + " Entities" : node.name}</div>`,
            onDragOver: () => `CTRL to parent | SHIFT to clone`
        })
    })
    onDestroy(() => draggable.onDestroy())
    function rename(){
        UndoRedoAPI.save(node, ACTION_HISTORY_TARGETS.ENGINE)
        EntityNameController.renameEntity(cacheName, node)
        UndoRedoAPI.save(node, ACTION_HISTORY_TARGETS.ENGINE)
    }
    $: nodeColor = lockedEntity === node.id ? undefined : node._hierarchyColor ? `color: rgb(${node._hierarchyColor})` : "color: var(--folder-color)";
</script>

<div class="info hierarchy-branch" data-node={node.id}>
    <button
            data-locked={lockedEntity === node.id ? "-" : ""}
            class="buttonIcon hierarchy-branch"
            style={nodeColor}
            on:click={() => setLockedEntity(node.id)}
    >
        <Icon>view_in_ar</Icon>
    </button>
    <div
            bind:this={ref}
            class="node"
            on:dblclick={() => isOnEdit = true}
            on:click={(e) => updateSelection(node.id, e.ctrlKey)}
    >
        <input
                disabled={!isOnEdit}
                on:change={e => {
                    cacheName = e.value
                    rename()
                }}
                on:blur={ev => {
                    cacheName = ev.currentTarget.value
                    rename()
                    isOnEdit = false
                }}
                on:keydown={e => {
                    if(e.code === KEYS.Enter){
                        cacheName = e.target.value
                        rename()
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