<script>
    import EnglishLocalization from "../../../../libs/EnglishLocalization";
    import Input from "../../../../components/input/Input.svelte";
    import Header from "../../../../components/view/components/Header.svelte";
    import Icon from "../../../../components/Icon/Icon.svelte";
    import createFolder from "./utils/create-folder";
    import Branch from "./components/Branch.svelte"
    import {v4} from "uuid"
    import ENTITY_WORKER_ACTIONS from "../../static/misc/ENTITY_WORKER_ACTIONS"
    import DataStoreController from "../../stores/DataStoreController";
    import {onDestroy, onMount} from "svelte";
    import infiniteScroll from "../../libs/infinite-scroll";
    import bindContextTarget from "../../../../components/context-menu/libs/bind-context-target";
    import getContextMenu from "./utils/get-context-menu";


    export let hidden = false
    export let switchView
    export let orientation
    const TRIGGERS = ["data-node"]
    let searchedEntity = ""
    let engine = {}
    let settings = {}

    const translate = key => EnglishLocalization.PROJECT.HIERARCHY[key]
    const unsubscribeEngine = DataStoreController.getEngine(v => engine = v)
    const ID = v4()
    const scroller = infiniteScroll(v => maxDepth = v, v => offset = v)

    let open = {}
    let toRender = []
    let ref
    let offset = 0
    let maxDepth = 0
    let entities = engine.entities
    let lastChangeID
    $: {
        if(engine.changeID !== lastChangeID) {
            lastChangeID = engine.changeID
            entities = engine.entities
        }
    }
    const contextMenuBinding = bindContextTarget("tree-view-" + ID, TRIGGERS)
    $: contextMenuBinding.rebind(getContextMenu())
    onMount(() => scroller.onMount(ref))
    onDestroy(() => {
        unsubscribeEngine()
        scroller.onDestroy()
        contextMenuBinding.onDestroy()
    })
    $: {
        window.entityWorker.postMessage({
            type: ENTITY_WORKER_ACTIONS.GET_HIERARCHY,
            actionID: ID
        })
        window.addEntityWorkerListener(
            payload => {
                console.log(payload.map(p => p.node))
                const data = []
                for (let i = 0; i < payload.length; i++) {
                    if (!payload[i].node.parent || open[payload[i].node.parent.id])
                        data.push({
                            depth: payload[i].depth,
                            node: entities.get(payload[i].node.id)
                        })
                }
                toRender = data
            },
            ID
        )

    }


    // $: {
    //     const newOpen = {...open}
    //     const openStructure = (entity) => {
    //         if (entity.parent)
    //             openStructure(entity.parent)
    //         newOpen[entity.id] = true
    //     }
    //     for (let i = 0; i < engine.selected.length; i++) {
    //         const entity = window.renderer.entitiesMap.get(engine.selected[i])
    //         openStructure(entity)
    //     }
    //     open = newOpen
    // }

</script>
<Header
        orientation={orientation}
        hidden={hidden}
        switchView={switchView}
        title={translate("TITLE")}
        icon={"account_tree"}
>
    <Input
            width={"100%"}
            placeholder={translate("SEARCH")}
            searchString={searchedEntity}
            setSearchString={v => searchedEntity = v}
    />
    <button class={"button"} on:click={createFolder}>
        <Icon>create_new_folder</Icon>
    </button>
</Header>
{#if !hidden}
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
                        nodeRef={toRender[i + offset].node}
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
{/if}

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