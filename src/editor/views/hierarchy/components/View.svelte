<script>
    import EngineStore from "../../../stores/EngineStore";
    import bindContextTarget from "../../../../shared/components/context-menu/libs/bind-context-target";
    import getContextMenu from "../utils/get-context-menu";
    import {onDestroy} from "svelte";
    import InfiniteScroller from "../../../../shared/components/infinite-scroller/InfiniteScroller.svelte";
    import Branch from "./Node.svelte";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import SelectionStore from "../../../stores/SelectionStore";
    import {Engine} from "../../../../../public/engine/production";
    import HierarchyController from "../../../libs/HierarchyController";

    export let ID
    export let translate
    export let searchString
    export let filteredComponent
    export let setIsEmpty
    const TRIGGERS = ["data-node", "data-self"]

    let engine = {}
    let settings = {}

    const unsubscribeEngine = EngineStore.getStore(v => engine = v)

    let open = new Map()
    let toRender = []
    let offset = 0
    let maxDepth = 0

    let selected = []
    let lockedEntity
    let surfaceSelected = {}

    const testSearch = (node) => {
        const s = searchString, f = filteredComponent
        return (s && node.name.toLowerCase().includes(s) || !s) &&
            (f && node.components.get(f) != null || !f)
    }

    const unsubscribeSelection = SelectionStore.getStore(() => {
        selected = SelectionStore.engineSelected
        lockedEntity = SelectionStore.lockedEntity
        surfaceSelected = HierarchyController.surfaceSelected
    })

    $: {
        if (engine.changeID) {
            const entities = Engine.entities
            const hierarchy = HierarchyController.hierarchy
            const data = []
            if (!searchString && !filteredComponent) {
                const data = []
                for (let i = 0; i < hierarchy.length; i++) {
                    if (data.length > maxDepth)
                        break
                    if (!hierarchy[i].node.parent || open.get(hierarchy[i].node.parent.id))
                        data.push(hierarchy[i])
                }
                toRender = data
            } else {
                for (let i = 0; i < entities.length; i++) {
                    if (data.length > maxDepth)
                        break
                    if (testSearch(entities[i]))
                        data.push({node: entities[i], depth: 0})
                }
                toRender = data
            }
        }
    }
    const contextMenuBinding = bindContextTarget(ID, TRIGGERS)
    $: contextMenuBinding.rebind(getContextMenu(open, () => open = open))
    $: setIsEmpty(toRender.length === 0)

    onDestroy(() => {
        unsubscribeSelection()
        unsubscribeEngine()
        contextMenuBinding.onDestroy()
    })
</script>


<InfiniteScroller
        setMaxDepth={v => maxDepth = v}
        setOffset={v => offset = v}
        data={toRender}
/>
{#if toRender.length > 0}
    {#each toRender as _, i}
        {#if toRender[i + offset]}
            <Branch
                    surfaceSelected={surfaceSelected}
                    nodeRef={toRender[i + offset].node}
                    depth={toRender[i + offset].depth}
                    selected={selected}

                    lockedEntity={lockedEntity}
                    setLockedEntity={v => SelectionStore.lockedEntity = v}
                    internalID={ID}
                    open={open}
                    updateOpen={() => open = open}
            />
        {/if}
    {/each}
{:else}
    <div data-empty="-">
        <Icon styles="font-size: 75px">account_tree</Icon>
        {translate("TITLE")}
    </div>
{/if}
