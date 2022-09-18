<script>
    import EngineStore from "../../../stores/EngineStore";
    import bindContextTarget from "../../../../shared/components/context-menu/libs/bind-context-target";
    import getContextMenu from "../utils/get-context-menu";
    import {onDestroy, onMount} from "svelte";
    import InfiniteScroller from "../../../../shared/components/infinite-scroller/InfiniteScroller.svelte";
    import Branch from "./Node.svelte";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import COMPONENTS from "../../../../../public/engine/static/COMPONENTS.json";
    import dragDrop from "../../../../shared/components/drag-drop/drag-drop";
    import {v4} from "uuid";
    import Entity from "../../../../../public/engine/production/instances/Entity";
    import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../../stores/templates/dispatch-renderer-entities";
    import SelectionStore from "../../../stores/SelectionStore";
    import QueryAPI from "../../../../../public/engine/production/apis/utils/QueryAPI";
    import {Engine} from "../../../../../public/engine/production";

    export let ID
    export let translate
    export let searchString
    export let filteredComponent
    export let setIsEmpty

    const TRIGGERS = ["data-node", "data-self"]

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
    const findSurface = (e, open) => {
        const entity = QueryAPI.getEntityByID(e)
        if(!entity)
            return
        let surface
        if (entity.parent) {
            surface = []
            let current = entity.parent
            while (current) {
                const breakTime =  !open[current?.id] && open[current?.parent?.id]

                if (!current.parent || breakTime) {

                    surface[0] = current.id
                    surface[1] = e
                    break
                }

                current = current?.parent
            }
        }
        return surface
    }
    $: {
        const surface = {}
        if (lockedEntity) {
            const found = findSurface(lockedEntity, open)
            if (found) {
                if (!surface[found[0]])
                    surface[found[0]] = []
                surface[found[0]].push(found[1])
            }
            for (let i = 0; i < selected.length; i++) {
                if (selected[i] === lockedEntity)
                    continue
                const found = findSurface(selected[i], open)
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
            entitiesArray = Engine.entities
        }
    }
    const contextMenuBinding = bindContextTarget(ID, TRIGGERS)
    $: contextMenuBinding.rebind(getContextMenu(open, v => open = v))


    const testSearch = (node) => {
        const s = searchString, f = filteredComponent
        return (s && node.name.toLowerCase().includes(s) || !s) &&
            (f && node.components.get(COMPONENTS[f]) != null || !f)
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

                    clone.parentCache = undefined
                    clone.parent = undefined

                    dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: clone})
                }
            },

            onDragOver: () =>  `CTRL to parent | SHIFT to clone`
        })
    })
    onDestroy(() => {
        unsubscribeSelection()
        unsubscribeEngine()
        contextMenuBinding.onDestroy()
        draggable.onDestroy()
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
