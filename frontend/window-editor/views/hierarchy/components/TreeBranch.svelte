<script lang="ts">
    import TreeBranchContent from "./TreeBranchContent.svelte";
    import LOCALIZATION_EN from "../../../../shared/static/LOCALIZATION_EN";
    import EntityConstructor from "../../../lib/controllers/EntityConstructor";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte";
    import Entity from "../../../../../engine-core/instances/Entity";
    import QueryAPI from "../../../../../engine-core/lib/utils/QueryAPI";

    export let depth: number
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
    $: hasChildren = entity.children.length > 0
    $: isSelected = selected.has(entity.id)
</script>

<div
        data-svelteselected={isSelected ? "-" : ""}
        data-sveltenode={entity.id}
        class="wrapper hierarchy-branch"
        style={"padding-left:" +  (depth * 18 + "px;") + (entity.active ? "" : "opacity: .5") }
>
    {#if hasChildren}
        <button data-sveltebuttondefault="-"
                data-svelteopen={isOpen ? "-" : ""}
                class="button-small hierarchy-branch"
                on:click={onExpand}
        >
            <Icon>arrow_drop_down</Icon>
        </button>
    {:else}
        <div class="button-small hierarchy-branch"></div>
    {/if}
    <TreeBranchContent {open} {entity} {lockedEntity} {setLockedEntity}/>
    <button data-sveltebuttondefault="-"
            style="margin-left: 4px"
            class="button-small hierarchy-branch"
            on:click={() => EntityConstructor.toggleEntityVisibility(entity)}
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

