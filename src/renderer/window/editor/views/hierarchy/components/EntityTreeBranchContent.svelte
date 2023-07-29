<script lang="ts">
    import dragDrop from "../../../../shared/components/drag-drop/drag-drop";
    import {onDestroy, onMount} from "svelte";
    import EntityNamingService from "../../../services/engine/EntityNamingService";
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import Entity from "../../../../../engine/core/instances/Entity";
    import ChangesTrackerStore from "../../../../shared/stores/ChangesTrackerStore";
    import EntityUpdateService from "../../../services/engine/EntityUpdateService";
    import ModalInput from "../../../components/modal-input/ModalInput.svelte";
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN";
    import HierarchyUtil from "../../../util/HierarchyUtil";
    import EntitySelectionStore from "../../../../shared/stores/EntitySelectionStore";

    export let entity: Entity
    export let lockedEntity: string
    export let isOpen: boolean
    export let isOnSearch: boolean

    let isOnEdit = false
    let ref: HTMLElement


    $: icons = HierarchyUtil.getEngineIcon(entity)
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
                EntityUpdateService.removeListener(entityID, ID)
            EntityUpdateService.addListener(entity.id, ID, () => {
                entityName = entity.name
                components = HierarchyUtil.mapComponents(entity)
                children = entity.children.array.length
            })
            children = entity.children.array.length
            components = HierarchyUtil.mapComponents(entity)
            entityName = entity.name
            entityID = entity.id
        }
    }
    $: {
        if (!isOnEdit && entityName !== entity.name) {
            ChangesTrackerStore.updateStore({changed: true})
            EntityNamingService.renameEntity(entity.name, entity)
            entityName = entity.name
        }
    }
    onMount(() => {
        draggable.onMount({
            targetElement: ref,
            onDragStart: () => entity,
            dragImage: _ => `<div style="display: flex; gap: 4px"><span style="font-size: .9rem;" data-svelteicon="-">view_in_ar</span> ${EntitySelectionStore.getEntitiesSelected().length > 1 ? EntitySelectionStore.getEntitiesSelected().length + " Entities" : entity.name}</div>`,
        })
    })
    onDestroy(() => {
        draggable.onDestroy()
        EntityUpdateService.removeListener(entityID, ID)
    })

    $: isLocked = lockedEntity === entity.id
</script>

<div class="info hierarchy-branch" data-sveltenode={entity.id} on:click={e => HierarchyUtil.updateSelection(entity.id, e.ctrlKey)}>
    <button

            data-sveltelocked={isLocked ? "-" : ""}
            class="button-icon hierarchy-branch"
            style={`--button-color: ${entity.isCollection ? "rgb(" + entity.colorIdentifier + ")" : !isLocked ? "var(--folder-color-darker)" : "var(--folder-color)" }`}
            on:click={() => EntitySelectionStore.setLockedEntity(entity.id)}
    >
        {#if entity.isCollection}
            <Icon styles="font-size: 1rem">inventory_2</Icon>
        {:else}
            <Icon styles="font-size: 1rem">view_in_ar</Icon>
        {/if}
    </button>

    <div bind:this={ref} on:dblclick={() => isOnEdit = true}>
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

    {#if !isOpen && !isOnSearch}
        {#each components as component}
            <div class="component">
                <Icon styles="font-size: .9rem">{component.icon}</Icon>
                <ToolTip content={component.label}/>
            </div>
        {/each}
        {#if children > 0}
            <div class="component" style="color: var(--folder-color)">
                <Icon styles="font-size: .9rem">category</Icon>
                <ToolTip content={LocalizationEN.CHILDREN}/>
                <small class="children-quantity">{children}</small>
            </div>
        {/if}
    {/if}
</div>

<style>
    .children-quantity {
        font-size: .5rem;
        position: absolute;
        left: 50%;
        bottom: -3px;
        background: rgba(0, 0, 0, .75);
        padding: 0 2px;
        height: fit-content;
        border-radius: 3px;
    }

    .component {
        color: var(--pj-accent-color-tertiary);
        display: flex;
        align-items: center;
        position: relative;
        justify-content: center;
    }
</style>
