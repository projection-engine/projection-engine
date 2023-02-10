<script lang="ts">
    import dragDrop from "../../../../shared/components/drag-drop/drag-drop";
    import {onDestroy, onMount} from "svelte";
    import getEngineIcon from "../utils/get-engine-icon";
    import updateSelection from "../utils/update-selection";
    import NameController from "../../../lib/controllers/NameController";
    import KEYS from "../../../static/KEYS.ts";
    import EditorActionHistory from "../../../lib/utils/EditorActionHistory";
    import SelectionStore from "../../../../shared/stores/SelectionStore";
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import Entity from "../../../../../engine-core/instances/Entity";
    import ChangesTrackerStore from "../../../../shared/stores/ChangesTrackerStore";
    import EntityUpdateController from "../../../lib/controllers/EntityUpdateController";
    import Modal from "../../../../shared/components/modal/Modal.svelte";

    export let entity: Entity
    export let lockedEntity: string
    export let setLockedEntity: Function

    let isOnEdit = false
    let ref: HTMLElement


    $: icons = getEngineIcon(entity)
    const draggable = dragDrop(true)

    $: draggable.disabled = isOnEdit

    const ID = crypto.randomUUID()
    let entityName = entity.name
    let entityID
    $: {
        if (entityID !== entity.id) {
            if (entityID)
                EntityUpdateController.removeListener(entityID, ID)
            EntityUpdateController.addListener(entity.id, ID, () => {
                entityName = entity.name
            })
            entityName = entity.name
            entityID = entity.id
        }
    }
    $: {
        if (!isOnEdit && entityName !== entity.name) {
            ChangesTrackerStore.updateStore(true)
            NameController.renameEntity(entity.name, entity)
            entityName = entity.name
        }
    }
    onMount(() => {
        draggable.onMount({
            targetElement: ref,
            onDragStart: () => entity,
            dragImage: _ => `<div style="display: flex; gap: 4px"><span style="font-size: .9rem;" data-svelteicon="-">view_in_ar</span> ${SelectionStore.engineSelected.length > 1 ? SelectionStore.engineSelected.length + " Entities" : entity.name}</div>`,
        })
    })
    onDestroy(() => {
        draggable.onDestroy()
        EntityUpdateController.removeListener(entityID, ID)
    })

</script>

<div class="info hierarchy-branch" data-svelteentity={entity.id}>
    <button
            data-sveltelocked={lockedEntity === entity.id ? "-" : ""}
            class="button-icon hierarchy-branch"
            style={`--button-color: rgb(${entity.isCollection ? entity.colorIdentifier : [203, 158, 53]})`}
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
            on:dblclick={() => isOnEdit = true}
            on:click={(e) => {
                isOnEdit = false
                updateSelection(entity.id, e.ctrlKey)
            }}
    >
        {entityName}
    </div>
    {#if isOnEdit}
        <Modal
                styles={"height: 35px; width: 10vw;"}
                handleClose={() => {
                    console.log("IM HERE")
                    isOnEdit = false
                }}>
            <input
                    on:change={e => {
                        entity.name = e.target.value
                    }}

                    on:keydown={e => {
                        if(e.code === KEYS.Enter)
                            isOnEdit = false
                    }}
            />
        </Modal>
    {/if}
    <ToolTip content={entityName}/>

</div>


<style>
    input {
        padding: 0 2px;
        border-radius: 0;
        background: none;
        border: none;
        outline: none;
        font-size: .7rem;
        color: var(--pj-color-primary);
        background: rgba(0, 0, 0, .65);
        height: 23px;
        width: 100%;
        overflow: visible;

    }

    input:disabled {
        -webkit-user-select: none !important;
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