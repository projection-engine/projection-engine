<script>
    import {onDestroy, onMount} from "svelte"
    import EntityTreeBranch from "./EntityTreeBranch.svelte"
    import ComponentTreeBranch from "./ComponentTreeBranch.svelte"
    import EntitySelectionStore from "../../../../shared/stores/EntitySelectionStore"
    import EntityHierarchyService from "../../../services/engine/EntityHierarchyService"

    import getViewportContext from "../../../templates/get-viewport-context"
    import Icon from "../../../../shared/components/icon/Icon.svelte"
    import ContextMenuService from "../../../../shared/lib/context-menu/ContextMenuService"
    import VirtualList from "@sveltejs/svelte-virtual-list"
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"

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

    	EntitySelectionStore.getInstance().addListener(COMPONENT_ID, data => {
            selectedList = data.array
            lockedEntity = data.lockedEntity
        })
    })

    onDestroy(() => {
    	EntitySelectionStore.getInstance().removeListener(COMPONENT_ID)
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
            />
        {:else}
            <EntityTreeBranch
                    {testSearch}
                    {isOnSearch}
                    entity={item.node}
                    depth={item.depth}
                    {selectedList}
                    {lockedEntity}
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
