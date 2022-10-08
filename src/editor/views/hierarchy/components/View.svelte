<script>
    import EngineStore from "../../../stores/EngineStore";
    import {onDestroy} from "svelte";
    import Branch from "./Node.svelte";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import SelectionStore from "../../../stores/SelectionStore";
    import {Engine} from "../../../../../public/engine/production";
    import HierarchyController from "../../../libs/HierarchyController";
    import ContextMenuController from "../../../../shared/libs/ContextMenuController";
    import Localization from "../../../../shared/libs/Localization";
    import viewportContext from "../../../templates/viewport-context";
    import VirtualList from '@sveltejs/svelte-virtual-list';
    import SettingsStore from "../../../stores/SettingsStore";

    export let ID
    export let translate
    export let searchString
    export let filteredComponent
    export let setIsEmpty
    let engine = {}
    let settings = {}

    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)

    let open = new Map()
    let toRender = []
    let selected = []
    let lockedEntity
    let surfaceSelected = {}

    const testSearch = (node) => {
        const s = searchString, f = filteredComponent
        return (s && node.name.includes(s) || !s) &&
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

                    if (!hierarchy[i].node.parent || open.get(hierarchy[i].node.parent.id))
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
                    label: Localization.PROJECT.HIERARCHY.TITLE
                },
                viewportContext(settings),
                ID
            )
        }
    }

    onDestroy(() => {
        unsubscribeSelection()
        unsubscribeEngine()
        ContextMenuController.destroy(ID)
    })

</script>


{#if SIZE > 0}
    <VirtualList items={toRender} let:item>
        <Branch
                surfaceSelected={surfaceSelected}
                nodeRef={item.node}
                depth={item.depth}
                selected={selected}

                lockedEntity={lockedEntity}
                setLockedEntity={v => SelectionStore.lockedEntity = v}
                internalID={ID}
                open={open}
                updateOpen={() => open = open}
        />
    </VirtualList>
{:else}
    <div data-empty="-">
        <Icon styles="font-size: 75px">account_tree</Icon>
        {translate("TITLE")}
    </div>
{/if}
