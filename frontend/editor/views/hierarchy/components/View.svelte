<script>
    import EngineStore from "../../../stores/EngineStore";
    import {onDestroy} from "svelte";
    import Branch from "./Node.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import SelectionStore from "../../../stores/SelectionStore";
    import HierarchyController from "../../../lib/controllers/HierarchyController";
    import ContextMenuController from "shared-resources/frontend/libs/ContextMenuController";
    import Localization from "../../../templates/LOCALIZATION_EN";
    import viewportContext from "../../../templates/viewport-context";
    import VirtualList from '@sveltejs/svelte-virtual-list';
    import SettingsStore from "../../../stores/SettingsStore";
    import Engine from "../../../../../engine-core/Engine";

    export let ID
    export let searchString
    export let filteredComponent
    export let setIsEmpty
    export let openTree
    export let setOpenTree
    let engine = {}
    let settings = {}

    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)

    let toRender = []
    let selected = []
    let lockedEntity
    const testSearch = (node) => {
        const s = searchString, f = filteredComponent
        return (s && node.name.includes(s) || !s) &&
            (f && node.components.get(f) != null || !f)
    }

    const unsubscribeSelection = SelectionStore.getStore(() => {
        selected = SelectionStore.engineSelected
        lockedEntity = SelectionStore.lockedEntity
    })

    $: {
        if (engine.changeID) {
            const entities = Engine.entities
            const hierarchy = HierarchyController.hierarchy
            const data = []
            if (!searchString && !filteredComponent) {
                const data = []
                for (let i = 0; i < hierarchy.length; i++) {

                    if (!hierarchy[i].node.parent || openTree[hierarchy[i].node.parent.id])
                        data.push(hierarchy[i])
                }
                toRender = data
            } else {
                for (let i = 0; i < entities.length; i++) {
                    if (testSearch(entities[i]))
                        data.push({node: entities[i], depth: 0})
                }
                toRender = data
            }
        }
    }
    $: SIZE = toRender.length
    $: setIsEmpty(SIZE === 0)
    $: {
        if (settings?.viewportHotkeys != null) {
            ContextMenuController.mount({
                    icon: "account_tree",
                    label: Localization.HIERARCHY
                },
                viewportContext(settings),
                ID
            )
        }
    }

    onDestroy(() => {
        unsubscribeSettings()
        unsubscribeSelection()
        unsubscribeEngine()
        ContextMenuController.destroy(ID)
    })

</script>


{#if SIZE > 0}
    <VirtualList items={toRender} let:item>
        <Branch
                nodeRef={item.node}
                depth={item.depth}
                selected={selected}

                lockedEntity={lockedEntity}
                setLockedEntity={v => SelectionStore.lockedEntity = v}
                internalID={ID}
                open={openTree}
                updateOpen={() => setOpenTree(openTree)}
        />
    </VirtualList>
{:else}
    <div data-empty="-">
        <Icon styles="font-size: 75px">account_tree</Icon>
        {Localization.HIERARCHY}
    </div>
{/if}
