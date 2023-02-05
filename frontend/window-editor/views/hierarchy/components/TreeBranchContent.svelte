<script lang="ts">
    import dragDrop from "../../../../shared/components/drag-drop/drag-drop";
    import {onDestroy, onMount} from "svelte";
    import getEngineIcon from "../utils/get-engine-icon";
    import updateSelection from "../utils/update-selection";
    import EntityNameController from "../../../lib/controllers/EntityNameController";
    import KEYS from "../../../static/KEYS.ts";
    import EditorActionHistory from "../../../lib/utils/EditorActionHistory";
    import SelectionStore from "../../../../shared/stores/SelectionStore";
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import Entity from "../../../../../engine-core/instances/Entity";

    export let entity: Entity
    export let lockedEntity: string
    export let setLockedEntity: Function

    let isOnEdit = false
    let ref: HTMLElement
    let cacheName: string
    $: cacheName = entity.name

    $: icons = getEngineIcon(entity)
    const draggable = dragDrop(true)
    $: draggable.disabled = isOnEdit


    onMount(() => {
        draggable.onMount({
            targetElement: ref,
            onDragStart: () => entity,
            dragImage: _ => `<div style="display: flex; gap: 4px"><span style="font-size: .9rem;" data-svelteicon="-">view_in_ar</span> ${SelectionStore.engineSelected.length > 1 ? SelectionStore.engineSelected.length + " Entities" : entity.name}</div>`,
        })
    })
    onDestroy(() => draggable.onDestroy())

    function rename() {
        EditorActionHistory.save(entity)
        EntityNameController.renameEntity(cacheName, entity)
        EditorActionHistory.save(entity)
    }

    $: entityColor = lockedEntity === entity.id ? undefined : entity._hierarchyColor ? `color: rgb(${entity._hierarchyColor})` : "color: var(--folder-color)";
</script>

<div class="info hierarchy-branch" data-svelteentity={entity.id}>
    <button data-sveltebuttondefault="-"
            data-sveltelocked={lockedEntity === entity.id ? "-" : ""}
            class="buttonIcon hierarchy-branch"
            style={entityColor}
            on:click={() => setLockedEntity(entity.id)}
    >
        {#if entity.isCollection}
            <Icon>inventory_2</Icon>
        {:else}
            <Icon>view_in_ar</Icon>
        {/if}
    </button>
    <div
            bind:this={ref}
            class="entity"
            on:dblclick={() => isOnEdit = true}
            on:click={(e) => updateSelection(entity.id, e.ctrlKey)}
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
        <!--{#each icons as icon}-->
        <!--    <Icon styles="font-size: .9rem; width: .9rem">-->
        <!--        <ToolTip content={icon.label}/>-->
        <!--        {icon.icon}-->
        <!--    </Icon>-->
        <!--{/each}-->
    </div>

</div>

<style>
    input {
        padding: 0 2px;
        border-radius: 0px;
        background: none;
        border: none;
        outline: none;
        font-size: .7rem;
        color: var(--pj-color-primary);
        background: rgba(0, 0, 0, .65);
        height: 23px;
        width: 100%;

    }

    input:disabled {
        background: none;
        color: var(--pj-color-quaternary);
    }

    .entity {
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

</style>