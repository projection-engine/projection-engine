<script lang="ts">
    import {onDestroy, onMount} from "svelte";
    import Branch from "./TreeNode.svelte";
    import SelectionStore from "../../../stores/SelectionStore";
    import HierarchyController from "../lib/HierarchyController";
    import LOCALIZATION_EN from "../../../../shared/static/LOCALIZATION_EN";
    import viewportContext from "../../../templates/viewport-context";
    import VirtualList from '@sveltejs/svelte-virtual-list';
    import SettingsStore from "../../../stores/SettingsStore";
    import Engine from "../../../../../engine-core/Engine";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import ContextMenuController from "../../../../shared/lib/context-menu/ContextMenuController";
    import ToRenderElement from "../template/ToRenderElement";


    export let ID:string
    export let inputValue:string
    export let filteredComponent:string
    export let setIsEmpty:Function
    export let openTree:{[key:string]:boolean}
    export let setOpenTree:Function

    const internalID = crypto.randomUUID()

    let toRender:ToRenderElement[] = []
    let selected:Map<string, boolean>
    let lockedEntity

    const unsubscribeSettings = SettingsStore.getStore(v => {
        ContextMenuController.mount(
            viewportContext(v),
            ID
        )
    })

    const testSearch = (node) => {
        const s = inputValue, f = filteredComponent
        return (s && node.name.includes(s) || !s) &&
            (f && node.components.get(f) != null || !f)
    }

    const unsubscribeSelection = SelectionStore.getStore(() => {
        selected = SelectionStore.TARGET === SelectionStore.TYPES.ENGINE ? SelectionStore.map : SelectionStore.EMPTY_MAP
        lockedEntity = SelectionStore.lockedEntity
    })

    onMount(() => {
        HierarchyController.registerListener(internalID, (op) => {
            const openLocal = op || openTree

            if(op !== undefined)
                setOpenTree(op)
            const entities = Engine.entities.array
            const hierarchy = HierarchyController.hierarchy
            const data = []
            if (!inputValue && !filteredComponent)
                for (let i = 0; i < hierarchy.length; i++) {
                    if (!hierarchy[i].node.parent || openLocal[hierarchy[i].node.parent.id])
                        data.push(hierarchy[i])
                }
             else
                for (let i = 0; i < entities.length; i++) {
                    if (testSearch(entities[i]))
                        data.push({node: entities[i], depth: 0})
                }
            toRender = data
            setIsEmpty(data.length === 0)
        })
    })

    onDestroy(() => {
        HierarchyController.removeListener(internalID)
        unsubscribeSettings()
        unsubscribeSelection()
        ContextMenuController.destroy(ID)
    })
</script>


{#if toRender.length > 0}
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
    <div data-svelteempty="-">
        <Icon styles="font-size: 75px">account_tree</Icon>
        {LOCALIZATION_EN.HIERARCHY}
    </div>
{/if}
