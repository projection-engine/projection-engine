<script>
    import Localization from "../../../../libs/Localization";
    import Input from "../../../../components/input/Input.svelte";
    import Header from "../../../../components/view/components/Header.svelte";

    import Branch from "./components/Branch.svelte"
    import {v4} from "uuid"
    import ENTITY_WORKER_ACTIONS from "../../static/misc/ENTITY_WORKER_ACTIONS"
    import DataStoreController from "../../stores/DataStoreController";
    import {onDestroy} from "svelte";
    import bindContextTarget from "../../../../components/context-menu/libs/bind-context-target";
    import getContextMenu from "./utils/get-context-menu";
    import Icon from "../../../../components/Icon/Icon.svelte";
    import InfiniteScroller from "../../libs/InfiniteScroller.svelte";


    export let hidden = undefined
    export let switchView = undefined
    export let orientation = undefined
    const TRIGGERS = ["data-node", "data-self"]
    let searchedEntity = ""
    let engine = {}
    let settings = {}

    const translate = key => Localization.PROJECT.HIERARCHY[key]
    const unsubscribeEngine = DataStoreController.getEngine(v => engine = v)
    const ID = v4()

    let open = {}
    let toRender = []
    let ref
    let offset = 0
    let maxDepth = 0
    let entities = engine.entities
    let lastChangeID = engine.changeID
    $: {
        if (engine.changeID !== lastChangeID) {
            lastChangeID = engine.changeID
            entities = engine.entities
        }
    }
    const contextMenuBinding = bindContextTarget("tree-view-" + ID, TRIGGERS)
    $: contextMenuBinding.rebind(getContextMenu())


    onDestroy(() => {
        unsubscribeEngine()
        contextMenuBinding.onDestroy()
    })
    $: {
        window.entityWorker.postMessage({
            type: ENTITY_WORKER_ACTIONS.GET_HIERARCHY,
            actionID: ID
        })
        window.addEntityWorkerListener(
            payload => {
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
    const updateSelection = (entity, ctrlKey) => {
        if (ctrlKey) {
            if (!engine.selected.includes(entity))
                DataStoreController.updateEngine({...engine, selected: [...engine.selected, entity]})
            else
                DataStoreController.updateEngine({...engine, selected: engine.selected.filter(e => e !== entity)})
        } else
            DataStoreController.updateEngine({...engine, selected: [entity]})
    }
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

</Header>
{#if !hidden}
    <div
            bind:this={ref}
            data-self={"-"}
            class={"wrapper"}
            id={"tree-view-" + ID}
    >
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
                            setSelected={updateSelection}
                            lockedEntity={engine.lockedEntity}
                            setLockedEntity={v => DataStoreController.updateEngine({...engine, lockedEntity: v})}
                            internalID={ID}
                            open={open}
                            setOpen={v => open = v}
                    />
                {/if}
            {/each}
        {:else}
            <div class="empty">
                <Icon styles="font-size: 75px">account_tree</Icon>
                {translate("TITLE")}
            </div>
        {/if}
    </div>
{/if}

<style>
    .empty {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: grid;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
        width: 100%;
        height: 100%;

        font-size: .8rem;
        color: var(--pj-color-quaternary);
    }

    .wrapper {
        position: relative;
        display: grid;
        align-content: flex-start;
        width: 100%;
        overflow: hidden;

        height: 100%;
        max-height: 100%;
    }
</style>