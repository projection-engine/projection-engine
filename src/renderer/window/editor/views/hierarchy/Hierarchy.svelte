<script>

    import Tree from "./components/Tree.svelte"
    import {onDestroy, onMount} from "svelte"
    import HotKeysController from "../../../shared/lib/HotKeysController"
    import dragDrop from "../../../shared/components/drag-drop/drag-drop"
    import EntityHierarchyService from "../../services/engine/EntityHierarchyService"
    import getViewportHotkeys from "../../templates/get-viewport-hotkeys"
    import Engine from "../../../../engine/core/Engine"
    import Header from "./components/Header.svelte"
    import LocalizationEN from "../../../../../shared/enums/LocalizationEN"
    import HierarchyUtil from "../../util/HierarchyUtil"
    import ViewStateStore from "../../../shared/stores/ViewStateStore";

    /** @type string */
    export default viewMetadata

    let toRender = []
    const ID = crypto.randomUUID()
    const draggable = dragDrop()
    let componentState = {search: "", filteredComponent: undefined, ref, openTree: {}, isOnSearch: false}

    function updateHierarchy(op) {
    	if (op !== componentState.openTree && op !== undefined){
            ViewStateStore.updateViewStateByProperty(viewMetadata, "openTree", op)
    		EntityHierarchyService.updateHierarchy()
        }
        toRender = HierarchyUtil.buildTree(componentState.openTree, componentState.search, componentState.filteredComponent)
    }

    function onUpdate(data){
        updateHierarchy()
        componentState = data
    }

    onMount(() => {
        HierarchyUtil.initializeView(draggable, ref)
    	EntityHierarchyService.registerListener(ID, updateHierarchy)
        ViewStateStore.initializeView(
            viewMetadata,
            {...componentState},
            onUpdate
        )
    })

    onDestroy(() => {
    	HotKeysController.unbindAction(ref)
    	draggable.onDestroy()
    })
</script>

<Header
        setFilteredComponent={v => ViewStateStore.updateViewStateByProperty(viewMetadata, "filteredComponent", v)}
        setSearch={v => ViewStateStore.updateViewStateByProperty(viewMetadata, "search", v)}
        filteredComponent={componentState.filteredComponent}
        search={componentState.search}
/>

<div
        data-svelteself={"-"}
        class="wrapper"
        id={ID}
        bind:this={ref}
>
    <div class="content" style={toRender.length === 0 ? "background: var(--pj-background-quaternary)" : undefined}>
        <Tree
                isOnSearch={componentState.search || componentState.filteredComponent}
                updateOpen={_ => updateHierarchy(componentState.openTree)}
                openTree={componentState.openTree}
                toRender={toRender}
                filteredComponent={componentState.filteredComponent}
                {ID}
                testSearch={node => HierarchyUtil.testSearch(componentState.filteredComponent, componentState.search, node)}
        />
    </div>
</div>


<style>

    .wrapper {
        position: relative;
        width: 100%;
        overflow-x: visible;
        overflow-y: hidden;
        height: 100%;
        max-height: 100%;
    }

    .content {
        min-width: 100%;
        height: 100%;
        width: fit-content;
        overflow: visible;
    }
</style>
