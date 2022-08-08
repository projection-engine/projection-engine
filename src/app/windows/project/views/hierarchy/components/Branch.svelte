<script>
    import COMPONENTS from "../../../libs/engine/data/COMPONENTS";
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import ENTITY_WORKER_ACTIONS from "../../../static/misc/ENTITY_WORKER_ACTIONS";
    import Packager from "../../../libs/engine/libs/builder/Packager";
    import "../css/Branch.css"

    const LEFT_BUTTON = 0
    export let depth = undefined
    export let nodeRef = undefined
    export let open = undefined
    export let setOpen = undefined
    export let selected = undefined
    export let setSelected = undefined
    export let lockedEntity = undefined
    export let setLockedEntity = undefined

    let ref
    let active = true
    $: {
        if (nodeRef && ref) {
            active = nodeRef.active
            const length = selected.length
            let is = false
            for (let i = 0; i < length; i++)
                is = is || selected[i] === nodeRef.id

            ref.setAttribute("data-selected", is ? "-" : "")
        }
    }

    $: icon = (() => {
        if (nodeRef) {
            if (nodeRef.components[COMPONENTS.POINT_LIGHT])
                return "lightbulb"
            if (nodeRef.components[COMPONENTS.DIRECTIONAL_LIGHT])
                return "light_mode"
            if (nodeRef.components[COMPONENTS.PROBE])
                return "lens_blur"
            if (nodeRef.components[COMPONENTS.MESH])
                return "view_in_ar"
            return "inventory_2"
        }
    })();


</script>

{#if nodeRef}
    <div
            data-node={nodeRef.id}
            id={nodeRef.id}
            bind:this={ref}
            class="wrapper hierarchy-branch"
            data-open={open[nodeRef.id] ? "-" : ""}
            data-selected={""}
            data-parentopen={open[nodeRef.parent?.id] ? "-" : ""}
            style={"padding-left:" +  (depth * 23 + "px")}
            on:mousedown={e => {
            if (e.button === LEFT_BUTTON && e.target.nodeName !== "BUTTON" && e.target.nodeName !== "SPAN")
                setSelected(nodeRef.id, e.ctrlKey)
    }}
            on:dragover={e => {
        e.preventDefault()

        ref.style.background = "rgb(203 110 53 / 50%)";
    }}
            on:dragleave={e => {
        e.preventDefault()
        ref.style.background = "transparent";
    }}
            on:drop={e => {
        e.preventDefault()
        ref.style.background = "transparent";
        const src = e.dataTransfer.getData("text")
        const entityDragged = window.renderer.entitiesMap.get(src)
        if(entityDragged) {

            //if(entityDragged.parent)
                //entityDragged.parent.children =entityDragged.parent.children.filter(c => c.id  !== entityDragged.id)

            // entityDragged.parent = nodeRef
            nodeRef.children.push(entityDragged)

            window.entityWorker.postMessage({
            type: ENTITY_WORKER_ACTIONS.UPDATE_ENTITIES,
            payload: window.renderer.entitiesMap
        })
        }
    }}
    >
        <div class="summary hierarchy-branch">
            {#if nodeRef.children.length > 0}
                <button
                        data-open={open[nodeRef.id] ? "-" : ""}
                        class="buttonSmall hierarchy-branch"
                        on:click={() => {
                            console.log(open[nodeRef.id])
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
                    }}
                >
                    <Icon>arrow_drop_down</Icon>
                </button>
            {:else}
                <div class="buttonSmall hierarchy-branch"></div>
            {/if}
            <div class="info hierarchy-branch">
                <button
                        data-locked={lockedEntity === nodeRef.id ? "-" : ""}
                        class="buttonIcon hierarchy-branch"
                        on:click={() => lockedEntity === nodeRef.id ? setLockedEntity(undefined) : setLockedEntity(nodeRef.id)}
                >
                    <Icon>{icon}</Icon>
                </button>
                <div
                        class="label hierarchy-branch"
                        draggable="true"
                        onDragStart={e => {
                    e.dataTransfer.setData("text", nodeRef.id)
                }}
                >
                    {nodeRef.name}
                </div>
            </div>
            <button
                    class="buttonSmall hierarchy-branch"
                    on:click={() => {
                window.renderer.entitiesMap.get(nodeRef.id).active = !active
                Packager.lights()
                if(!active)
                    window.renderer.activeEntitiesSize--
                else
                    window.renderer.activeEntitiesSize++
                active = !active
            }}>
                <Icon styles="font-size: .9rem">
                    {#if active}
                        visibility
                    {:else}
                        visibility_off
                    {/if}

                </Icon>
            </button>
        </div>
    </div>
{/if}

