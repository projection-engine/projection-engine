<script>
    import Node from "./components/Node.svelte"
    import {onDestroy} from "svelte";
    import bindContextTarget from "../../../../../components/context-menu/libs/bind-context-target";
    import getContextMenu from "./utils/get-context-menu";
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import InfiniteScroller from "../../../../../components/infinite-scroller/InfiniteScroller.svelte";
    import UIStoreController from "../../../stores/UIStoreController";

    export let ID
    export let translate
    export let searchString

    const TRIGGERS = ["data-node", "data-self"]
    let store = {}

    const unsubscribe = UIStoreController.getStore(v => store = v)


    let open = {}
    let toRender
    let offset = 0
    let maxDepth = 0

    $: {

        const data = []
        if (!searchString) {
            const callback = (node, depth) => {
                data.push({node, depth})
                for (let i = 0; i < node.children.length; i++)
                    callback(node.children[i], depth + 1)
            }
            const arr = Array.from(store.entities.values())
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].parent !== undefined)
                    continue
                callback(arr[i], 0)
            }
            toRender = data
        } else {
            const arr = Array.from(store.entities.values())
            for (let i = 0; i < arr.length; i++)
                if ((searchString && arr[i].name.toLowerCase().includes(searchString) || !searchString))
                    data.push({node: arr[i], depth: 0})
            toRender = data
        }
    }
    const contextMenuBinding = bindContextTarget(ID, TRIGGERS, (trigger, element) => {
        if (trigger === TRIGGERS[0])
            UIStoreController.updateStore({...store, selected: [element.getAttribute(trigger)]})
    })
    $: contextMenuBinding.rebind(getContextMenu(open, v => open = v))
    onDestroy(() => {
        unsubscribe()
        contextMenuBinding.onDestroy()
    })

    const updateSelection = (entity, ctrlKey) => {
        if (ctrlKey) {
            if (!engine.selected.includes(entity))
                UIStoreController.updateStore({...store, selected: [...store.selected, entity]})
            else
                UIStoreController.updateStore({...store, selected: store.selected.filter(e => e !== entity)})
        } else
            UIStoreController.updateStore({...store, selected: [entity]})
    }
</script>


<InfiniteScroller
        setMaxDepth={v => maxDepth = v}
        setOffset={v => offset = v}
        data={toRender}
/>
{#if toRender.length > 0}
    {#each toRender as _, i}
        {#if i < maxDepth && toRender[i + offset]}
            <Node
                    depth={toRender[i + offset].depth}
                    open={open}
                    setOpen={v => open = v}
                    selected={store.selected}
                    setSelected={updateSelection}
                    node={toRender[i + offset].node}
            />
        {/if}
    {/each}
{:else}
    <div data-empty="-">
        <Icon styles="font-size: 75px">grid_view</Icon>
        {translate("TITLE")}
    </div>
{/if}
