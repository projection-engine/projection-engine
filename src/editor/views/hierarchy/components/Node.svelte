<script>
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import "../css/Branch.css"
    import DraggableEntity from "./Draggable.svelte";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import Localization from "../../../../shared/libs/Localization";
    import EntityConstructor from "../../../libs/EntityConstructor";

    export let depth = undefined
    export let nodeRef = undefined
    export let open = undefined
    export let updateOpen = undefined
    export let selected = undefined
    export let lockedEntity = undefined
    export let setLockedEntity = undefined
    export let surfaceSelected

    let ref
    let hiddenActiveChildren

    $: {
        if (ref) {
            const length = selected.length
            let is = false
            for (let i = 0; i < length; i++)
                is = is || selected[i] === nodeRef.id

            ref.setAttribute("data-selected", is ? "-" : "")
        }
    }

    const onExpand = () => {
        if (!open.get(nodeRef.id)) {
            open.set(nodeRef.id, true)
            updateOpen()
        } else {
            open.delete(nodeRef.id)
            const callback = (node) => {
                node.children.forEach(c => {
                    if (open.get(c.id)) {
                        open.delete(c.id)
                        callback(c)
                    }
                })
            }
            callback(nodeRef)
            updateOpen()
        }
    }


    $: hiddenActiveChildren = surfaceSelected[nodeRef.id]
</script>

<div
        data-node={nodeRef.id}
        bind:this={ref}
        class="wrapper hierarchy-branch"
        style={"padding-left:" +  (depth * 18 + "px;") + (nodeRef.active ? "" : "opacity: .5") }
>
    {#if nodeRef.children.length > 0}
        <button
                data-open={open.get(nodeRef.id) ? "-" : ""}
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
            hiddenActiveChildren={hiddenActiveChildren}
                     lockedEntity={lockedEntity}
            setLockedEntity={setLockedEntity}
    />
    <button
            style="margin-left: 4px"
            class="button-small hierarchy-branch"
            on:click={() => EntityConstructor.hideEntity(nodeRef)}
    >
        <ToolTip content={Localization.PROJECT.HIERARCHY.DEACTIVATE}/>
        <Icon styles="font-size: .8rem">
            {#if nodeRef.active}
                visibility
            {:else}
                visibility_off
            {/if}
        </Icon>
    </button>
</div>

