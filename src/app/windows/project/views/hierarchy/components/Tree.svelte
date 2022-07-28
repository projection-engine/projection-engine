<script>
    import Branch from "./Branch.svelte"
    import {v4} from "uuid"
    import ENTITY_WORKER_ACTIONS from "../../../static/misc/ENTITY_WORKER_ACTIONS"
    import DataStoreController from "../../../stores/DataStoreController";
    import {onDestroy, onMount} from "svelte";
    import infiniteScroll from "../../../libs/infinite-scroll";


    const ID = v4()
    const localActionID = v4(), TRIGGERS = ["data-node"]
    let engine = {}
    let settings = {}
    const unsubscribeEngine = DataStoreController.getEngine(v => engine = v)

    let open = {}
    let toRender = []
    let ref
    let offset
    let maxDepth
    const scroller = infiniteScroll(v => maxDepth = v, v => offset = v)

    onMount(() => scroller.onMount(ref))
    onDestroy(() => {
        unsubscribeEngine()
        scroller.onDestroy()
    })
    $: () => {
        window.entityWorker.postMessage({
            type: ENTITY_WORKER_ACTIONS.GET_HIERARCHY,
            actionID: localActionID
        })
        window.addEntityWorkerListener(
            payload => {
                const data = []
                for (let i = 0; i < payload.length; i++) {
                    if (!payload[i].node.parent || open[payload[i].node.parent.id])
                        data.push(payload[i])
                }
                toRender = data
            },
            localActionID
        )
    }
    $: {
        const newOpen = {...open}
        const openStructure = (entity) => {
            if (entity.parent)
                openStructure(entity.parent)
            newOpen[entity.id] = true
        }
        for (let i = 0; i < engine.selected.length; i++) {
            const entity = window.renderer.entitiesMap.get(engine.selected[i])
            openStructure(entity)
        }
        open = newOpen
    }

</script>

<div
        bind:this={ref}
        data-self={"self"}
        data-offset={offset}
        class={"wrapper"}
        id={"tree-view-" + ID}
>
    {#each toRender as e, i}
        {#if i < maxDepth}
            <Branch
                    node={toRender[i + offset].node}
                    depth={toRender[i + offset].depth}
                    selected={engine.selected}
                    setSelected={(entity, ctrlKey) => {
                    if (ctrlKey) {
                        if (!engine.selected.includes(entity))
                            DataStoreController.updateEngine({...engine, selected: [...engine.selected, entity]})
                        else
                            DataStoreController.updateEngine({...engine, selected: engine.selected.filter(e => e !== entity)})
                    } else
                        DataStoreController.updateEngine({...engine, selected: [entity]})
                }}
                    lockedEntity={engine.lockedEntity}
                    setLockedEntity={v => DataStoreController.updateEngine({...engine, lockedEntity: v})}
                    internalID={ID}
                    open={open}
                    setOpen={v => open = v}

            />
        {/if}
    {/each}
</div>

<style>
    .wrapper {
        position: relative;
        display: grid;
        align-content: flex-start;
        width: 100%;
        overflow: hidden;

        height: 100%;
        max-height: 100%;
        color: var(--pj-color-tertiary);
        background: var(--pj-background-tertiary);
    }
</style>