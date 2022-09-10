<script>
    import Icon from "../../../../components/icon/Icon.svelte";
    import "../css/Branch.css"
    import DraggableEntity from "./DraggableEntity.svelte";
    import updateSelection from "../utils/update-selection";
    import ToolTip from "../../../../components/tooltip/ToolTip.svelte";
    import Localization from "../../../../libs/Localization";
    import EngineStore from "../../../stores/EngineStore";
    import {v4} from "uuid";

    const LEFT_BUTTON = 0
    export let depth = undefined
    export let nodeRef = undefined
    export let open = undefined
    export let setOpen = undefined
    export let selected = undefined
    export let lockedEntity = undefined
    export let setLockedEntity = undefined
    export let surfaceSelected

    let ref
    let hiddenActiveChildren

    $: {
        if (nodeRef && ref) {
            const length = selected.length
            let is = false
            for (let i = 0; i < length; i++)
                is = is || selected[i] === nodeRef.id

            ref.setAttribute("data-selected", is ? "-" : "")
        }
    }

    const onExpand = () => {
        if (!open[nodeRef.id])
            setOpen({...open, [nodeRef.id]: true})
        else {
            const newOpen = {...open}
            delete newOpen[nodeRef.id]
            const callback = (node) => {
                node.children.forEach(c => {
                    if (newOpen[c.id]) {
                        delete newOpen[c.id]
                        callback(c)
                    }
                })
            }
            callback(nodeRef)
            setOpen(newOpen)
        }
    }
    const loopHierarchy = (entity, newValue) => {
        for(let i = 0; i < entity.children.length; i++)
            loopHierarchy(entity.children[i], newValue)
        entity.active = newValue
    }
    const onHide = () => {
        loopHierarchy(nodeRef, !nodeRef.active)
        EngineStore.updateStore({...EngineStore.engine, changeID: v4()})
    }

    $: {
        if(nodeRef)
            hiddenActiveChildren = surfaceSelected[nodeRef.id]
    }
</script>

{#if nodeRef}
    <div
            data-node={nodeRef.id}
            id={nodeRef.id}
            bind:this={ref}
            class="wrapper hierarchy-branch"
            style={"padding-left:" +  (depth * 18 + "px;") + (nodeRef.active ? "" : "opacity: .5") }
            on:mousedown={(e) => {
                if (e.button === LEFT_BUTTON && e.target.nodeName !== "BUTTON" && e.target.nodeName !== "SPAN")
                    updateSelection(nodeRef.id, e.ctrlKey)
            }}
    >
        <div class="summary hierarchy-branch">
            {#if nodeRef.children.length > 0}
                <button
                        data-open={open[nodeRef.id] ? "-" : ""}
                        class="button-small hierarchy-branch"
                        on:click={onExpand}
                >
                    <Icon>arrow_drop_down</Icon>
                </button>
            {:else}
                <div class="button-small hierarchy-branch"></div>
            {/if}
            <DraggableEntity setOpen={setOpen} open={open} node={nodeRef} hiddenActiveChildren={hiddenActiveChildren} lockedEntity={lockedEntity} setLockedEntity={setLockedEntity}/>
            <button class="button-small hierarchy-branch" on:click={onHide}>
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
    </div>
{/if}

