<script lang="ts">
    import EngineStore from "../../../stores/EngineStore";
    import {onDestroy} from "svelte";
    import Branch from "./Node.svelte";
    import SelectionStore from "../../../stores/SelectionStore";
    import HierarchyController from "../lib/HierarchyController";
    import LOCALIZATION_EN from "../../../../static/LOCALIZATION_EN";
    import viewportContext from "../../../templates/viewport-context";
    import VirtualList from '@sveltejs/svelte-virtual-list';
    import SettingsStore from "../../../stores/SettingsStore";
    import Engine from "../../../../../engine-core/Engine";
    import Icon from "../../../../components/icon/Icon.svelte";
    import ContextMenuController from "../../../../lib/context-menu/ContextMenuController";
    import MutableObject from "../../../../../engine-core/MutableObject";
    import ToRenderElement from "../template/ToRenderElement";

    export let ID:string
    export let searchString:string
    export let filteredComponent:string
    export let setIsEmpty:Function
    export let openTree:{[key:string]:boolean}
    export let setOpenTree:Function
    let engine:MutableObject = {}
    let settings:MutableObject = {}

    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)

    let toRender:ToRenderElement[] = []
    let selected:Map<string, boolean>
    let lockedEntity
    const testSearch = (node) => {
        const s = searchString, f = filteredComponent
        return (s && node.name.includes(s) || !s) &&
            (f && node.components.get(f) != null || !f)
    }

    const unsubscribeSelection = SelectionStore.getStore(() => {
        selected = SelectionStore.TARGET === SelectionStore.TYPES.ENGINE ? SelectionStore.map : SelectionStore.EMPTY_MAP
        lockedEntity = SelectionStore.lockedEntity
    })

    $: {
        if (engine.changeID) {
            const entities = Engine.entities
            const hierarchy = HierarchyController.hierarchy
            const data = []
            if (!searchString && !filteredComponent) {
                const data:ToRenderElement[] = []
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
            ContextMenuController.mount(
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
        {LOCALIZATION_EN.HIERARCHY}
    </div>
{/if}
