<script>
    import COMPONENTS from "../../../libs/engine/data/COMPONENTS";
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import ENTITY_WORKER_ACTIONS from "../../../data/misc/ENTITY_WORKER_ACTIONS";
    import "../../hierarchy/css/Branch.css"
    import Renderer from "../../../libs/engine/Renderer";
    import DataStoreController from "../../../stores/DataStoreController";
    import {v4} from "uuid";

    const LEFT_BUTTON = 0
    export let depth = 0
    export let node = undefined
    export let open = undefined
    export let setOpen = undefined
    export let selected = undefined
    export let setSelected = undefined


    let ref
    $: {
        if (node && ref) {
            const length = selected.length
            let is = false
            for (let i = 0; i < length; i++)
                is = is || selected[i] === node.id

            ref.setAttribute("data-selected", is ? "-" : "")
        }
    }


    const handler = (e) => {
        switch (e.type) {
            case "mousedown":
                if (e.button === LEFT_BUTTON && e.target.nodeName !== "BUTTON" && e.target.nodeName !== "SPAN")
                    setSelected(node.id, e.ctrlKey)
                break
            case "dragstart":
                e.dataTransfer.setData("text", node.id)
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
                const entityDragged = Renderer.entitiesMap.get(src)
                console.log(entityDragged)
                if (entityDragged) {
                    entityDragged.parent = node
                    node.children.push(entityDragged)


                    const ID = v4()
                    window.addEntityWorkerListener(() => {
                        DataStoreController.updateEngine({...DataStoreController.engine, changeID: ID})
                    }, ID)
                    window.entityWorker.postMessage({
                        type: ENTITY_WORKER_ACTIONS.UPDATE_ENTITIES,
                        payload: Renderer.entitiesMap,
                        actionID: ID
                    })

                }
                break
            }
        }
    }

</script>

{#if node}
    <div
            data-node={node.id}
            id={node.id}
            bind:this={ref}
            class="wrapper hierarchy-branch"
            data-open={open[node.id] ? "-" : ""}
            data-selected={""}
            data-parentopen={open[node.parent?.id] ? "-" : ""}
            style={"padding-left:" +  (depth * 23 + "px")}
            on:mousedown={handler}
            on:dragover={handler}
            on:dragleave={handler}
            on:drop={handler}
            on:dragstart={handler}
            draggable="true"

    >
        <div class="summary hierarchy-branch">
            {#if node.children.length > 0}
                <button
                        data-open={open[node.id] ? "-" : ""}
                        class="buttonSmall hierarchy-branch"
                        on:click={() => {
                            console.log(open[node.id])
                        if (!open[node.id])
                            setOpen({...open, [node.id]: true})
                        else {
                            const newOpen = {...open}
                            delete newOpen[node.id]
                            const callback = (node) => {
                                node.children.forEach(c => {
                                    if (newOpen[c.id]) {
                                        delete newOpen[c.id]
                                        callback(c)
                                    }
                                })
                            }
                            callback(node)
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
                <div class="buttonIcon hierarchy-branch">
                    <Icon>category</Icon>
                </div>
                <div
                        class="label hierarchy-branch"
                >
                    {node.name}
                </div>
            </div>
        </div>
    </div>
{/if}

