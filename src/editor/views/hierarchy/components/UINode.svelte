<script>
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import "../css/Branch.css"
    import UserInterfaceController from "../../../../../public/engine/production/controllers/UserInterfaceController";

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
                const entityDragged = UserInterfaceController.entities.get(src)

                if (entityDragged) {
                    entityDragged.parent = node
                    node.children.push(entityDragged)
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
            style={"padding-left:" +  (depth * 18 + "px")}
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
                        class="button-small hierarchy-branch"
                        on:click={() => {
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
                <div class="button-small hierarchy-branch"></div>
            {/if}
            <div class="info hierarchy-branch">
                <div class="buttonIcon hierarchy-branch">
                    <Icon>category</Icon>
                </div>
                <div class="label hierarchy-branch">
                    {node.name}
                </div>
            </div>
        </div>
    </div>
{/if}

