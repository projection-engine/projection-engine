<script>
    import Localization from "../../../../libs/Localization";
    import Input from "../../../../components/input/Input.svelte";
    import Header from "../../../../components/view/components/Header.svelte";

    import Branch from "./components/Node.svelte"
    import {v4} from "uuid"
    import {onDestroy} from "svelte";
    import bindContextTarget from "../../../../components/context-menu/libs/bind-context-target";
    import getContextMenu from "./utils/get-context-menu";
    import Icon from "../../../../components/Icon/Icon.svelte";
    import InfiniteScroller from "../../../../components/infinite-scroller/InfiniteScroller.svelte";
    import UIStoreController from "../../stores/UIStoreController";
    import Node from "./components/Node.svelte";


    export let hidden = undefined
    export let switchView = undefined
    export let orientation = undefined
    const TRIGGERS = ["data-node", "data-self"]
    let searchedEntity = ""
    let store = {}

    const translate = key => Localization.PROJECT.UI[key]
    const unsubscribe = UIStoreController.getStore(v => store = v)
    const ID = v4()

    let open = {}
    let toRender = []
    let ref
    let offset = 0
    let maxDepth = 0
    $: {
        let data = []
        const callback = (node, depth) => {
            data.push({node, depth})
            for (let i = 0; i < node.children.length; i++)
                callback(node.children[i], depth + 1)
        }
        const arr = Array.from(store.entities.values())
        for (let i = 0; i < arr.length; i++) {
            if (!searchedEntity) {
                if (arr[i].parent !== undefined)
                    continue
                callback(arr[i], 0)
            } else if (arr[i].name.includes(searchedEntity))
                data.push({node: arr[i], depth: 0})
        }
        toRender = data
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
<Header
        orientation={orientation}
        hidden={hidden}
        switchView={switchView}
        title={translate("TITLE")}
        icon={"grid_view"}
>
    <Input
            width={"100%"}
            placeholder={translate("SEARCH")}
            searchString={searchedEntity}
            setSearchString={v => searchedEntity = v}
    />
</Header>
{#if !hidden}
    <div
            bind:this={ref}
            data-self={"-"}
            class="wrapper"
            id={ID}
    >
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
    </div>
{/if}

<style>

    .wrapper {
        position: relative;
        display: grid;
        align-content: flex-start;
        width: 100%;
        overflow-y: hidden;
        overflow-x: auto;

        height: 100%;
        max-height: 100%;
    }
</style>