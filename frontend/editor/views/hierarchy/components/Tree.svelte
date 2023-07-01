<script>
    import {onDestroy, onMount} from "svelte"
    import EntityTreeBranch from "./EntityTreeBranch.svelte"
    import ComponentTreeBranch from "./ComponentTreeBranch.svelte"
    import SelectionStore from "../../../../stores/SelectionStore"
    import EntityHierarchyService from "../../../services/engine/EntityHierarchyService"

    import getViewportContext from "../../../templates/get-viewport-context"
    import Icon from "../../../../shared/components/icon/Icon.svelte"
    import ContextMenuService from "../../../../shared/lib/context-menu/ContextMenuService"
    import VirtualList from "@sveltejs/svelte-virtual-list"
    import LocalizationEN from "../../../../../shared/LocalizationEN"
    import SelectionStoreUtil from "../../../util/SelectionStoreUtil"
    import EngineStore from "../../../../stores/EngineStore"

    const COMPONENT_ID = crypto.randomUUID()
    /** @type { string }*/
    export let ID
    /** @type { function }*/
    export let testSearch
    /** @type { boolean }*/
    export let isOnSearch
    /** @type { {[key: string]: boolean} }*/
    export let openTree
    /** @type { function }*/
    export let updateOpen
    /** @type {HierarchyToRenderElement[]}*/
    export let toRender

    let selectedList
    let lockedEntity

    onMount(() => {
    	ContextMenuService.getInstance().mount(getViewportContext(), ID)
    	EngineStore.getInstance().addListener(COMPONENT_ID, data => lockedEntity = data.lockedEntity, ["lockedEntity"])
    	SelectionStore.getInstance().addListener(COMPONENT_ID, () => selectedList = SelectionStoreUtil.getEntitiesSelected())
    })

    onDestroy(() => {
    	EngineStore.getInstance().removeListener(COMPONENT_ID)
    	SelectionStore.getInstance().removeListener(COMPONENT_ID)
    	EntityHierarchyService.removeListener(COMPONENT_ID)
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
