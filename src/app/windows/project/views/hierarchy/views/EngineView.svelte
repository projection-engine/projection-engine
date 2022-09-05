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
    import SelectionStore from "../../../stores/SelectionStore";
    import RendererController from "../../../libs/engine/production/controllers/RendererController";

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
    let selected = []
    let lockedEntity
    let surfaceSelected = {}
    const findSurface = (e) => {
        const entity = RendererController.entitiesMap.get(e)
        let surface
        if (entity.parent) {
            surface = []
            let parent = entity.parent
            while (parent) {
                if (!parent.parent) {
                    surface[0] = parent.id
                    surface[1] = e
                }
                parent = parent?.parent
            }
        }
        return surface
    }
    $: {
        const surface = {}
        if (lockedEntity) {
            const found = findSurface(lockedEntity)
            if (found) {
                if (!surface[found[0]])
                    surface[found[0]] = []
                surface[found[0]].push(found[1])
            }
            for (let i = 0; i < selected.length; i++) {
                if (selected[i] === lockedEntity)
                    continue
                const found = findSurface(selected[i])
                if (!found)
                    continue
                if (!surface[found[0]])
                    surface[found[0]] = []
                surface[found[0]].push(found[1])
            }
        }
        surfaceSelected = surface
    }
    const unsubscribeSelection = SelectionStore.getStore(() => {
        selected = SelectionStore.engineSelected
        lockedEntity = SelectionStore.lockedEntity
    })

    $: {
        if (engine.changeID !== lastChangeID) {
            lastChangeID = engine.changeID
            entitiesArray = Array.from(engine.entities.values())
        }
    }
    const contextMenuBinding = bindContextTarget(
        ID,
        TRIGGERS,
        (trigger, element) => {
            if (trigger === TRIGGERS[0])
                SelectionStore.engineSelected = [element.getAttribute(trigger)]
        })
    $: contextMenuBinding.rebind(getEngineContextMenu(open, v => open = v))
    onDestroy(() => {
        unsubscribeSelection()
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
                } else if (event.shiftKey) {
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
                    surfaceSelected={surfaceSelected}
                    nodeRef={toRender[i + offset].node}
                    depth={toRender[i + offset].depth}
                    selected={selected}

                    lockedEntity={lockedEntity}
                    setLockedEntity={v => SelectionStore.lockedEntity = v}
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
