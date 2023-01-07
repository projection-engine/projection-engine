<script lang="ts">
    import DraggableEntity from "./EntityDraggable.svelte";
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import EntityConstructor from "../../../lib/controllers/EntityConstructor";
    import Icon from "../../../../../components/icon/Icon.svelte";
    import ToolTip from "../../../../../components/tooltip/ToolTip.svelte";
    import Entity from "../../../../../../engine-core/instances/Entity";

    export let depth: number
    export let nodeRef: Entity
    export let open: { [key: string]: boolean }
    export let updateOpen: Function
    export let selected: Map<string, boolean>
    export let lockedEntity: string
    export let setLockedEntity: Function

    $: isSelected = selected.has(nodeRef.id)

    const onExpand = () => {
        if (!open[nodeRef.id]) {
            open[nodeRef.id] = true
            updateOpen()
        } else {
            delete open[nodeRef.id]
            const callback = (node) => {
                node.children.forEach(c => {
                    if (open[c.id]) {
                        delete open[c.id]
                        callback(c)
                    }
                })
            }
            callback(nodeRef)
            updateOpen()
        }
    }

    $: isOpen = open[nodeRef.id]


</script>

<div
        data-selected={isSelected ? "-" : ""}
        data-node={nodeRef.id}

        class="wrapper hierarchy-branch"
        style={"padding-left:" +  (depth * 18 + "px;") + (nodeRef.active ? "" : "opacity: .5") }
>
    {#if nodeRef.children.length > 0}
        <button
                data-open={isOpen ? "-" : ""}
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
    <button
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

