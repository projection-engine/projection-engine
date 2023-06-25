<script lang="ts">
    import {onDestroy, onMount} from "svelte";
    import EntityTreeBranch from "./EntityTreeBranch.svelte";
    import ComponentTreeBranch from "./ComponentTreeBranch.svelte";
    import SelectionStore from "../../../../stores/SelectionStore";
    import EntityHierarchyService from "../../../services/engine/EntityHierarchyService";

    import getViewportContext from "../../../templates/get-viewport-context";
    import SettingsStore from "../../../../stores/SettingsStore";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import ContextMenuService from "../../../../shared/lib/context-menu/ContextMenuService";
    import HierarchyToRenderElement from "../template/ToRenderElement";
    import VirtualList from '@sveltejs/svelte-virtual-list';
    import LocalizationEN from "../../../../../shared/LocalizationEN";
    import SelectionStoreUtil from "../../../util/SelectionStoreUtil";
    import EngineStore from "../../../../stores/EngineStore";

    export let ID: string
    export let testSearch: Function
    export let isOnSearch: boolean
    export let openTree: { [key: string]: boolean }
    export let updateOpen: Function
    export let toRender: HierarchyToRenderElement[]
    const internalID = crypto.randomUUID()

    let selectedList
    let lockedEntity

    const unsubscribeSettings = SettingsStore.getStore(v => {
        ContextMenuService.getInstance().mount(
            getViewportContext(v),
            ID
        )
    })

    const unsubscribeSelection = SelectionStore.getStore(() => {
        selectedList = SelectionStoreUtil.getEntitiesSelected()
        lockedEntity = SelectionStoreUtil.getLockedEntity()
    })

    onMount(() => {
        EngineStore.getInstance().addListener(
            "hierarchy-tree" + ID,
            (data) => lockedEntity = data.lockedEntity,
            ["lockedEntity"]
        )
    })

    onDestroy(() => {
        EngineStore.getInstance().removeListener("hierarchy-tree" + ID)
        EntityHierarchyService.removeListener(internalID)
        unsubscribeSettings()
        unsubscribeSelection()
        ContextMenuService.getInstance().destroy(ID)
    })
</script>


{#if toRender.length > 0}
    <VirtualList items={toRender} itemHeight={23} let:item>
        {#if item.component}
            <ComponentTreeBranch
                    component={item.component}
                    depth={item.depth }
                    setLockedEntity={v => SelectionStoreUtil.setLockedEntity(v)}
            />
        {:else}
            <EntityTreeBranch
                    {testSearch}
                    {isOnSearch}
                    entity={item.node}
                    depth={item.depth}
                    {selectedList}
                    {lockedEntity}
                    setLockedEntity={v => SelectionStoreUtil.setLockedEntity(v)}
                    open={openTree}
                    {updateOpen}
            />
        {/if}
    </VirtualList>
{:else}
    <div data-svelteempty="-">
        <Icon styles="font-size: 75px">account_tree</Icon>
        {LocalizationEN.HIERARCHY}
    </div>
{/if}
