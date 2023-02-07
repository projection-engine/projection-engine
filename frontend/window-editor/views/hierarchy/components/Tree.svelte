<script lang="ts">
    import {onDestroy} from "svelte";
    import TreeBranch from "./TreeBranch.svelte";
    import SelectionStore from "../../../../shared/stores/SelectionStore";
    import HierarchyController from "../../../lib/HierarchyController";
    import LOCALIZATION_EN from "../../../../shared/static/LOCALIZATION_EN";
    import viewportContext from "../../../templates/viewport-context";
    import VirtualList from '@sveltejs/svelte-virtual-list';
    import SettingsStore from "../../../../shared/stores/SettingsStore";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import ContextMenuController from "../../../../shared/lib/context-menu/ContextMenuController";
    import ToRenderElement from "../template/ToRenderElement";


    export let ID: string
    export let openTree: { [key: string]: boolean }
    export let updateOpen: Function
    export let toRender: ToRenderElement[]

    const internalID = crypto.randomUUID()


    let selected: Map<string, boolean>
    let lockedEntity

    const unsubscribeSettings = SettingsStore.getStore(v => {
        ContextMenuController.mount(
            viewportContext(v),
            ID
        )
    })

    const unsubscribeSelection = SelectionStore.getStore(() => {
        selected = SelectionStore.TARGET === SelectionStore.TYPES.ENGINE ? SelectionStore.map : SelectionStore.EMPTY_MAP
        lockedEntity = SelectionStore.lockedEntity
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
        <TreeBranch
                entity={item.node}
                depth={item.depth}
                {selected }
                {lockedEntity}
                setLockedEntity={v => SelectionStore.lockedEntity = v}
                internalID={ID}
                open={openTree}
                {updateOpen}
        />
    </VirtualList>
{:else}
    <div data-svelteempty="-">
        <Icon styles="font-size: 75px">account_tree</Icon>
        {LOCALIZATION_EN.HIERARCHY}
    </div>
{/if}
