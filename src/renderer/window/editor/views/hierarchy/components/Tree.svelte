<script lang="ts">
    import EntityTreeBranch from "./EntityTreeBranch.svelte"
    import ComponentTreeBranch from "./ComponentTreeBranch.svelte"
    import Icon from "../../../../shared/components/icon/Icon.svelte"
    import VirtualList from "@sveltejs/svelte-virtual-list"
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"
    import HierarchyToRenderElement from "../template/ToRenderElement";

    const COMPONENT_ID = crypto.randomUUID()
    export let ID:string
    export let testSearch:GenericVoidFunctionWithP<MutableObject>
    export let isOnSearch:boolean
    export let selectedList:string[]
    export let lockedEntity:string|undefined
    export let openTree:{[key: string]: boolean}
    export let updateOpen:GenericVoidFunction
    export let toRender:HierarchyToRenderElement[]

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
