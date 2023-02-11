<script lang="ts">
    import dragDrop from "../../../../shared/components/drag-drop/drag-drop";
    import {onDestroy, onMount} from "svelte";
    import getEngineIcon from "../utils/get-engine-icon";
    import updateSelection from "../utils/update-selection";
    import NameController from "../../../lib/controllers/NameController";
    import SelectionStore from "../../../../shared/stores/SelectionStore";
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import Entity from "../../../../../engine-core/instances/Entity";
    import ChangesTrackerStore from "../../../../shared/stores/ChangesTrackerStore";
    import EntityUpdateController from "../../../lib/controllers/EntityUpdateController";
    import ModalInput from "../../../components/modal-input/ModalInput.svelte";
    import mapComponents from "../utils/map-components";
    import LOCALIZATION_EN from "../../../../../static/objects/LOCALIZATION_EN";

    export let entity: Entity
    export let lockedEntity: string
    export let isOpen: boolean
    export let setLockedEntity: Function

    let isOnEdit = false
    let ref: HTMLElement


    $: icons = getEngineIcon(entity)
    const draggable = dragDrop(true)
    $: draggable.disabled = isOnEdit




    const ID = crypto.randomUUID()
    let entityName = entity.name
    let entityID
    let components = []
    let children = 0
    $: {
        if (entityID !== entity.id) {
            if (entityID)
                EntityUpdateController.removeListener(entityID, ID)
            EntityUpdateController.addListener(entity.id, ID, () => {
                entityName = entity.name
                components = mapComponents(entity)
                children = entity.children.length
            })
            children = entity.children.length
            components = mapComponents(entity)
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

<div class="info hierarchy-branch"    data-sveltenode={entity.id} on:click={e => updateSelection(entity.id, e.ctrlKey)}>
    <button
            data-sveltelocked={lockedEntity === entity.id ? "-" : ""}
            class="button-icon hierarchy-branch"
            style={`--button-color: rgb(${entity.isCollection ? entity.colorIdentifier : [203, 158, 53]})`}
            on:click={() => setLockedEntity(entity.id)}
    >
        {#if entity.isCollection}
            <Icon styles="font-size: 1rem">inventory_2</Icon>
        {:else}
            <Icon styles="font-size: 1rem">view_in_ar</Icon>
        {/if}
    </button>

    <div
            bind:this={ref}
            on:dblclick={() => isOnEdit = true}
    >
        {entityName}
        <ToolTip content={entityName}/>
    </div>

    {#if isOnEdit}
        <ModalInput
                initialValue={entityName}
                handleClose={value => {
                entity.name = value
                isOnEdit = false
            }}
        />
    {/if}

    {#if !isOpen}
        {#each components as component}
            <div class="component">
                <Icon styles="font-size: .9rem">{component.icon}</Icon>
                <ToolTip content={component.label}/>
            </div>
        {/each}
        {#if children > 0}
            <div class="component" style="color: var(--folder-color)">
                <Icon styles="font-size: .9rem">category</Icon>
                <ToolTip content={LOCALIZATION_EN.CHILDREN}/>
                <small class="children-quantity">{children}</small>
            </div>
        {/if}
    {/if}
</div>

<style>
    .children-quantity{
        font-size: .5rem;
        position: absolute;
        right: -4px;
        bottom: -4px;

    }
    .component {
        color: var(--pj-accent-color-tertiary);
        display: flex;
        align-items: center;
        position: relative;
        justify-content: center;
    }
</style>
