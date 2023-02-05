<script lang="ts">
    import DraggableEntity from "./EntityDraggable.svelte";
    import LOCALIZATION_EN from "../../../../shared/static/LOCALIZATION_EN";
    import EntityConstructor from "../../../lib/controllers/EntityConstructor";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte";
    import Entity from "../../../../../engine-core/instances/Entity";
    import QueryAPI from "../../../../../engine-core/lib/utils/QueryAPI";
    import Engine from "../../../../../engine-core/Engine";

    export let depth: number
    export let nodeRef: Entity
    export let open: { [key: string]: boolean }
    export let updateOpen: Function
    export let selected: Map<string, boolean>
    export let lockedEntity: string
    export let setLockedEntity: Function

    const onExpand = () => {
        if (!open[nodeRef.id]) {
            open[nodeRef.id] = true
            updateOpen()
        } else {

            delete open[nodeRef.id]
            QueryAPI.loopHierarchy(nodeRef, (child) => {
                delete open[child.id]
            })
            updateOpen()
        }
    }

    $: isOpen = open[nodeRef.id]
    $: isSelected = selected.has(nodeRef.id)
</script>

<div
        data-svelteselected={isSelected ? "-" : ""}
        data-sveltenode={nodeRef.id}

        class="wrapper hierarchy-branch"
        style={"padding-left:" +  (depth * 18 + "px;") + (nodeRef.active ? "" : "opacity: .5") }
>
    {#if nodeRef.children.length > 0}
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
    <DraggableEntity
            updateOpen={updateOpen}
            open={open} node={nodeRef}
            lockedEntity={lockedEntity}
            setLockedEntity={setLockedEntity}
    />
    <button data-sveltebuttondefault="-"
            style="margin-left: 4px"
            class="button-small hierarchy-branch"
            on:click={() => EntityConstructor.toggleEntityVisibility(nodeRef)}
    >
        <ToolTip content={LOCALIZATION_EN.DEACTIVATE}/>
        <Icon styles="font-size: .8rem">
            {#if nodeRef.active}
                visibility
            {:else}
                visibility_off
            {/if}
        </Icon>
    </button>
</div>

