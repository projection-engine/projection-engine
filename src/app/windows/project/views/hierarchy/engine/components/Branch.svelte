<script>
    import COMPONENTS from "../../../../libs/engine/data/COMPONENTS";
    import Icon from "../../../../../../components/Icon/Icon.svelte";
    import BundlerAPI from "../../../../libs/engine/libs/apis/BundlerAPI";
    import "../css/Branch.css"
    import RendererController from "../../../../libs/engine/RendererController";
    import RendererStoreController from "../../../../stores/RendererStoreController";
    import {v4} from "uuid";

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

    const handler = (e) => {
        switch (e.type) {
            case "mousedown":
                if (e.button === LEFT_BUTTON && e.target.nodeName !== "BUTTON" && e.target.nodeName !== "SPAN")
                    setSelected(nodeRef.id, e.ctrlKey)
                break
            case "dragstart":
                e.dataTransfer.setData("text", nodeRef.id)
                break
            case "dragleave":
                e.preventDefault()
                ref.style.background = "transparent";
                break
            case "dragover":
                e.preventDefault()
                ref.style.background = "rgb(203 110 53 / 50%)";
                break
            case "drop": {

                e.preventDefault()
                ref.style.background = "transparent";
                const src = e.dataTransfer.getData("text")
                const entityDragged = RendererController.entitiesMap.get(src)
                console.log(entityDragged)
                if (entityDragged) {
                    entityDragged.parent = nodeRef
                    nodeRef.children.push(entityDragged)

                    const ID = v4()
                    RendererStoreController.updateEngine({...RendererStoreController.engine, changeID: ID})
                }
                break
            }
        }
    }

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
            style={"padding-left:" +  (depth * 18 + "px")}
            on:mousedown={handler}
            on:dragover={handler}
            on:dragleave={handler}
            on:drop={handler}
            on:dragstart={handler}
            draggable="true"

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
                >
                    {nodeRef.name}
                </div>
            </div>
            <button
                    class="buttonSmall hierarchy-branch"
                    style="margin-right: 8px"
                    on:click={() => {
                        RendererController.entitiesMap.get(nodeRef.id).active = !active
                        BundlerAPI.packageLights()

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

