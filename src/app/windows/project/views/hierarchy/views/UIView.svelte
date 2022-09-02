<script>
    import Node from "../components/UINode.svelte"
    import {onDestroy, onMount} from "svelte";
    import bindContextTarget from "../../../../../components/context-menu/libs/bind-context-target";
    import getUiContextMenu from "../utils/get-ui-context-menu";
    import Icon from "../../../../../components/icon/Icon.svelte";
    import InfiniteScroller from "../../../../../components/infinite-scroller/InfiniteScroller.svelte";
    import UIStore from "../../../stores/UIStore";

    export let ID
    export let translate
    export let searchString
    export let setIsEmpty

    const TRIGGERS = ["data-node", "data-self"]
    let store = {}

    const unsubscribe = UIStore.getStore(v => store = v)


    let open = {}
    let toRender = []
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
            UIStore.updateStore({...store, selected: [element.getAttribute(trigger)]})
    })
    onMount(() => contextMenuBinding.rebind(getUiContextMenu()))
    onDestroy(() => {
        unsubscribe()
        contextMenuBinding.onDestroy()
    })

    const updateSelection = (entity, ctrlKey) => {
        if (ctrlKey) {
            if (!engine.selected.includes(entity))
                UIStore.updateStore({...store, selected: [...store.selected, entity]})
            else
                UIStore.updateStore({...store, selected: store.selected.filter(e => e !== entity)})
        } else
            UIStore.updateStore({...store, selected: [entity]})
    }
    $: setIsEmpty(toRender.length === 0)
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
