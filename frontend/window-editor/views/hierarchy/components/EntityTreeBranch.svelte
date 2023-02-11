<script lang="ts">
    import TreeBranchContent from "./EntityTreeBranchContent.svelte";
    import LOCALIZATION_EN from "../../../../../static/objects/LOCALIZATION_EN";
    import EntityFactory from "../../../lib/controllers/EntityFactory";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte";
    import Entity from "../../../../../engine-core/instances/Entity";
    import QueryAPI from "../../../../../engine-core/lib/utils/QueryAPI";

    export let depth: number
    export let isOnSearch: boolean
    export let entity: Entity
    export let open: { [key: string]: boolean }
    export let updateOpen: Function
    export let selected: Map<string, boolean>
    export let lockedEntity: string
    export let setLockedEntity: Function

    const onExpand = () => {
        if (!open[entity.id]) {
            open[entity.id] = true
            updateOpen()
        } else {

            delete open[entity.id]
            QueryAPI.loopHierarchy(entity, (child) => {
                delete open[child.id]
            })
            updateOpen()
        }
    }

    $: isOpen = open[entity.id]
    $: isSelected = selected.has(entity.id)
    $: childQuantity = Math.max(entity.children.array.length, entity.allComponents.length )
    $: hasChildren = childQuantity > 0

</script>

<div
        data-svelteselected={isSelected ? "-" : ""}
        data-sveltenode={entity.id}

        class="wrapper hierarchy-branch"
        style={"padding-left:" +  (depth * 18 + "px;") + (entity.active ? "" : "opacity: .5") }
>

    {#if hasChildren && !isOnSearch}
        {#if isOpen}
            <div data-sveltevertdivider="-" style={`height: ${23 * childQuantity}px`} class="divider"></div>
        {/if}
        <button
                data-sveltebuttondefault="-"
                data-svelteopen={isOpen ? "-" : ""}
                class="button-small hierarchy-branch"
                style="position: relative; z-index: 11;"
                on:click={onExpand}
        >
            <Icon>arrow_drop_down</Icon>
        </button>
    {:else}
        <div class="button-small hierarchy-branch"></div>
    {/if}
    <TreeBranchContent  {isOpen} {entity} {lockedEntity} {setLockedEntity}/>
    <button
            data-sveltebuttondefault="-"
            class="button-visibility"
            on:click={() => EntityFactory.toggleEntityVisibility(entity)}
    >
        <ToolTip content={LOCALIZATION_EN.DEACTIVATE}/>
        <Icon styles="font-size: .8rem">
            {#if entity.active}
                visibility
            {:else}
                visibility_off
            {/if}
        </Icon>
    </button>
</div>

<style>
    .button-visibility {
        opacity: inherit;
        position: sticky;
        right: 0;
        background: inherit;
        min-height: 23px;
        min-width: 23px;
        max-height: 23px;
        max-width: 23px;

        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 0;
        background: var(--pj-background-quaternary);
    }
    .divider{
        position: absolute;
        top: 23px;
        transform: translateX(.3rem);
        z-index: 10;
        background: none;
        border-left: var(--pj-border-secondary) 1px dashed;
    }
</style>