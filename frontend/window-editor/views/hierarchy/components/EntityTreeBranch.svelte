<script lang="ts">
    import EntityTreeBranchContent from "./EntityTreeBranchContent.svelte";
    import LOCALIZATION_EN from "../../../../../static/objects/LOCALIZATION_EN";
    import EntityFactory from "../../../lib/controllers/EntityFactory";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte";
    import Entity from "../../../../../engine-core/instances/Entity";
    import QueryAPI from "../../../../../engine-core/lib/utils/QueryAPI";
    import ComponentTreeBranch from "./ComponentTreeBranch.svelte";

    export let depth: number
    export let isOnSearch: boolean
    export let entity: Entity
    export let openTree: { [key: string]: boolean }
    export let updateOpen: Function
    export let selected: Map<string, boolean>
    export let lockedEntity: string
    export let setLockedEntity: Function

    const onExpand = () => {
        if (!openTree[entity.id]) {
            openTree[entity.id] = true
            updateOpen()
        } else {

            delete openTree[entity.id]
            QueryAPI.loopHierarchy(entity, (child) => {
                delete openTree[child.id]
            })
            updateOpen()
        }
    }

    $: isOpen = openTree[entity.id]
    $: isSelected = selected.has(entity.id)
    $: childQuantity = Math.max(entity.children.length, entity.allComponents.length)
    $: hasChildren = childQuantity > 0
    $: children = entity.children
    $: components = entity.allComponents
</script>
<div class="container" class:stripes={depth===0}>
    <div
            data-svelteselected={isSelected ? "-" : ""}
            data-sveltenode={entity.id}

            class="wrapper hierarchy-branch"
            style={"padding-left:" +  (depth * 18 + "px;") + (entity.active ? "" : "opacity: .5") }
    >
        {#if hasChildren && !isOnSearch}
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
        <EntityTreeBranchContent {isOpen} {entity} {lockedEntity} {setLockedEntity}/>
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
    {#if isOpen}
        <div data-sveltevertdivider="-" style={`border-color: ${isSelected ? "var(--pj-accent-color)" : "var(--pj-border-secondary)"}; border-left-style: ${depth === 0 ? "solid" : "dashed"}; left: ${depth * 18}px;`} class="divider"></div>
    {/if}
    {#if isOpen}
        {#each components as component, componentIndex}
            <ComponentTreeBranch
                    component={component}
                    depth={depth + 1}
                    {setLockedEntity}
            />
        {/each}
        {#each children as child, childIndex}
            <svelte:self
                    depth={depth + 1}
                    {isOnSearch}
                    entity={child}
                    {selected }
                    {lockedEntity}
                    {setLockedEntity}
                    {openTree}
                    {updateOpen}
            />
        {/each}
    {/if}
</div>

<style>
    .container{
        position: relative;
        min-width: 100%;
        width: fit-content;
        height: fit-content;
        overflow: visible;
    }
    .button-visibility {
        opacity: inherit;
        position: sticky;
        right: 0;
        border-radius: 0;
        background: var(--pj-background-tertiary);
        min-height: 23px;
        min-width: 23px;
        max-height: 23px;
        max-width: 23px;

        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
    }

    .divider {
        height: calc(100% - 23px);
        position: absolute;
        top: 23px;
        transform: translateX(.3rem);
        z-index: 10;
        background: none;
        border-left: var(--pj-border-secondary) 1px dashed;
    }
    .stripes{
        background: repeating-linear-gradient(
                to bottom,
                var(--pj-background-secondary) 0px,
                var(--pj-background-secondary) 23px,
                var(--pj-background-tertiary) 23px,
                var(--pj-background-tertiary) 46px
        );
    }
</style>