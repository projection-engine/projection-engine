<script>
    import RendererStoreController from "../../../stores/RendererStoreController";
    import bindContextTarget from "../../../../../components/context-menu/libs/bind-context-target";
    import getContextMenu from "./utils/get-context-menu";
    import {onDestroy} from "svelte";
    import InfiniteScroller from "../../../../../components/infinite-scroller/InfiniteScroller.svelte";
    import Branch from "./components/Branch.svelte";
    import Icon from "../../../../../components/icon/Icon.svelte";
    import COMPONENTS from "../../../libs/engine/production/data/COMPONENTS";

    export let ID
    export let translate
    export let searchString
    export let filteredComponent

    const TRIGGERS = ["data-node", "data-self"]
    let searchedEntity = ""
    let engine = {}
    let settings = {}

    const unsubscribeEngine = RendererStoreController.getEngine(v => engine = v)

    let open = {}
    let toRender = []
    let offset = 0
    let maxDepth = 0
    let entitiesArray = []
    let mappedEntities = []
    let lastChangeID = engine.changeID
    $: {
        if (engine.changeID !== lastChangeID) {
            lastChangeID = engine.changeID
            entitiesArray = window.renderer.entities
        }
    }
    const contextMenuBinding = bindContextTarget(ID, TRIGGERS, (trigger, element) => {
        if (trigger === TRIGGERS[0])
            RendererStoreController.updateEngine({...engine, selected: [element.getAttribute(trigger)]})
    })
    $: contextMenuBinding.rebind(getContextMenu(open, v => open = v))
    onDestroy(() => {
        unsubscribeEngine()
        contextMenuBinding.onDestroy()
    })

    const testSearch = (node) => {

        const s = searchString, f = filteredComponent
        return (s && node.name.toLowerCase().includes(s) || !s) &&
            (f && node.components[COMPONENTS[f]] != null || !f)
    }

    $: {

        const data = []
        if (!searchString && !filteredComponent) {
            const callback = (node, depth) => {
                data.push({node, depth})
                for (let i = 0; i < node.children.length; i++)
                    callback(node.children[i], depth + 1)
            }
            for (let i = 0; i < entitiesArray.length; i++) {
                if (entitiesArray[i].parent !== undefined)
                    continue
                callback(entitiesArray[i], 0)
            }
            mappedEntities = data
        } else {
            for (let i = 0; i < entitiesArray.length; i++)
                if (testSearch(entitiesArray[i]))
                    data.push({node: entitiesArray[i], depth: 0})
            toRender = data
        }
    }

    $: {
        if (!searchString && !filteredComponent) {
            const data = []
            for (let i = 0; i < mappedEntities.length; i++) {
                if (!mappedEntities[i].node.parent || open[mappedEntities[i].node.parent.id])
                    data.push(mappedEntities[i])
            }
            toRender = data
        }
    }

    const updateSelection = (entity, ctrlKey) => {
        if (ctrlKey) {
            if (!engine.selected.includes(entity))
                RendererStoreController.updateEngine({...engine, selected: [...engine.selected, entity]})
            else
                RendererStoreController.updateEngine({...engine, selected: engine.selected.filter(e => e !== entity)})
        } else
            RendererStoreController.updateEngine({...engine, selected: [entity]})
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
            <Branch
                    nodeRef={toRender[i + offset].node}
                    depth={toRender[i + offset].depth}
                    selected={engine.selected}

                    lockedEntity={engine.lockedEntity}
                    setSelected={updateSelection}
                    setLockedEntity={v => RendererStoreController.updateEngine({...engine, lockedEntity: v})}
                    internalID={ID}
                    open={open}
                    setOpen={v => open = v}
            />
        {/if}
    {/each}
{:else}
    <div data-empty="-">
        <Icon styles="font-size: 75px">account_tree</Icon>
        {translate("TITLE")}
    </div>
{/if}
