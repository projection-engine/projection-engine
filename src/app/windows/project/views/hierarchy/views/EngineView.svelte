<script>
    import EngineStore from "../../../stores/EngineStore";
    import bindContextTarget from "../../../../../components/context-menu/libs/bind-context-target";
    import getEngineContextMenu from "../utils/get-engine-context-menu";
    import {onDestroy, onMount} from "svelte";
    import InfiniteScroller from "../../../../../components/infinite-scroller/InfiniteScroller.svelte";
    import Branch from "../components/EngineNode.svelte";
    import Icon from "../../../../../components/icon/Icon.svelte";
    import COMPONENTS from "../../../libs/engine/production/data/COMPONENTS";
    import dragDrop from "../../../../../components/drag-drop";
    import {v4} from "uuid";
    import Entity from "../../../libs/engine/production/templates/Entity";
    import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../../stores/templates/dispatch-renderer-entities";

    export let ID
    export let translate
    export let searchString
    export let filteredComponent
    export let setIsEmpty

    const TRIGGERS = ["data-node", "data-self"]
    let searchedEntity = ""
    let engine = {}
    let settings = {}

    const unsubscribeEngine = EngineStore.getStore(v => engine = v)

    let open = {}
    let toRender = []
    let offset = 0
    let maxDepth = 0
    let entitiesArray = []
    let mappedEntities = []
    let lastChangeID
    let ref
    $: {
        if (engine.changeID !== lastChangeID) {
            lastChangeID = engine.changeID
            entitiesArray = Array.from(engine.entities.values())
        }
    }
    const contextMenuBinding = bindContextTarget(ID, TRIGGERS, (trigger, element) => {
        if (trigger === TRIGGERS[0])
            EngineStore.updateStore({...engine, selected: [element.getAttribute(trigger)]})
    })
    $: contextMenuBinding.rebind(getEngineContextMenu(open, v => open = v))
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
                    data.push({node: entitiesArray[i], depth: 1})
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
                EngineStore.updateStore({...engine, selected: [...engine.selected, entity]})
            else
                EngineStore.updateStore({...engine, selected: engine.selected.filter(e => e !== entity)})
        } else
            EngineStore.updateStore({...engine, selected: [entity]})
    }
    $: setIsEmpty(toRender.length === 0)

    const draggable = dragDrop()
    onMount(() => {

        draggable.onMount({
            targetElement: ref.parentElement,
            onDrop: (entityDragged, event) => {
                if (event.ctrlKey) {
                    if (entityDragged.parent)
                        entityDragged.parent.children = entityDragged.parent.children.filter(c => c !== entityDragged)
                    entityDragged.parent = undefined
                    EngineStore.updateStore({...EngineStore.engine, changeID: v4()})
                } else if(event.shiftKey) {
                    const clone = entityDragged.clone()
                    clone.parent = undefined
                    dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: clone})
                }
            },

            onDragOver: (data) => {
                if (data instanceof Entity)
                    return `CTRL to parent | SHIFT to clone`
                return `<span style="font-size: .9rem;" data-icon="-">clear</span> Invalid entity`
            }
        })
    })
</script>

<span style="display: none" bind:this={ref}></span>
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
                    setLockedEntity={v => EngineStore.updateStore({...engine, lockedEntity: v})}
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
