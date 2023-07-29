<script lang="ts">

    import Tree from "./components/Tree.svelte"
    import {onDestroy, onMount} from "svelte"
    import HotKeysController from "../../../shared/lib/HotKeysController"
    import dragDrop from "../../../shared/components/drag-drop/drag-drop"
    import EntityHierarchyService from "../../services/engine/EntityHierarchyService"
    import Header from "./components/Header.svelte"
    import HierarchyUtil from "../../util/HierarchyUtil"
    import SerializedState from "../../components/view/SerializedState.svelte";
    import ContextMenuService from "../../../shared/lib/context-menu/ContextMenuService";
    import getViewportContext from "../../templates/get-viewport-context";
    import EntitySelectionStore from "../../../shared/stores/EntitySelectionStore";
    import HierarchyToRenderElement from "./template/ToRenderElement";

    const ID = crypto.randomUUID()
    const draggable = dragDrop()
    let ref: HTMLElement
    let search = ""
    let filteredComponent = undefined
    let openTree = {}
    let toRender: HierarchyToRenderElement[] = []
    let selectedList: string[] = []
    let lockedEntity

    function updateHierarchy(op?: MutableObject) {
        const openLocal = op ?? openTree
        if (op !== openTree && op !== undefined)
            EntityHierarchyService.updateHierarchy()
        openTree = openLocal
        toRender = HierarchyUtil.buildTree(openTree, search, filteredComponent)
    }

    onMount(() => {
        HierarchyUtil.initializeView(draggable, ref)
        EntityHierarchyService.registerListener(ID, updateHierarchy)
        ContextMenuService.getInstance().mount(getViewportContext(), ID)
        EntitySelectionStore.getInstance().addListener(ID, data => {
            selectedList = data.array
            lockedEntity = data.lockedEntity
        })
    })

    onDestroy(() => {
        HotKeysController.unbindAction(ref)
        draggable.onDestroy()
        EntitySelectionStore.getInstance().removeListener(ID)
        EntityHierarchyService.removeListener(ID)
        ContextMenuService.getInstance().destroy(ID)
    })
</script>

<SerializedState
        state={{search, filteredComponent, openTree}}
        onStateInitialize={ state => {
             search = state.search
             filteredComponent = state.filteredComponent
             openTree  = state.openTree
             updateHierarchy()
        }}
/>
<Header
        setFilteredComponent={v => {filteredComponent = v; updateHierarchy()}}
        setSearch={v => {search = v; updateHierarchy()}}
        {filteredComponent}
        {search}
/>
<div
        data-svelteself={"-"}
        class="wrapper"
        id={ID}
        bind:this={ref}
>
    <div class="content" style={toRender.length === 0 ? "background: var(--pj-background-quaternary)" : undefined}>
        <Tree
                isOnSearch={search || filteredComponent}
                updateOpen={() => updateHierarchy(openTree)}
                {openTree}
                {toRender}
                {selectedList}
                {lockedEntity}
                {filteredComponent}
                {ID}
                testSearch={node => HierarchyUtil.testSearch(filteredComponent, search, node)}
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
