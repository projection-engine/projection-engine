<script>

    import Tree from "./components/Tree.svelte"
    import {onDestroy, onMount} from "svelte"
    import HotKeysController from "../../../shared/lib/HotKeysController"
    import dragDrop from "../../../shared/components/drag-drop/drag-drop"
    import EntityHierarchyService from "../../services/engine/EntityHierarchyService"
    import getViewportHotkeys from "../../templates/get-viewport-hotkeys"
    import Engine from "../../../../engine-core/Engine"
    import Header from "./components/Header.svelte"
    import LocalizationEN from "../../../../shared/LocalizationEN"
    import HierarchyUtil from "../../util/HierarchyUtil"

    let search = ""
    let filteredComponent = undefined
    let ref
    let openTree = {}
    let isOnSearch = false
    let toRender = []

    const ID = crypto.randomUUID()
    const draggable = dragDrop()

    function updateHierarchy(op) {
    	const openLocal = op ?? openTree
    	if (op !== openTree && op !== undefined)
    		EntityHierarchyService.updateHierarchy()
    	openTree = openLocal
    	toRender = HierarchyUtil.buildTree(openTree, search, filteredComponent)
    }

    $: {
    	isOnSearch = search || filteredComponent
    	updateHierarchy()
    }

    onMount(() => {
    	HotKeysController.bindAction(
    		ref,
    		Object.values(getViewportHotkeys()),
    		"public",
    		LocalizationEN.VIEWPORT
    	)
    	draggable.onMount({
    		targetElement: ref,
    		onDrop: (entityDragged, event) => {
    			const node = event.composedPath().find(n => n?.getAttribute?.("data-sveltenode") != null)?.getAttribute?.("data-sveltenode")
    			HierarchyUtil.handleDrop(event, entityDragged, node ? Engine.entities.get(node) : undefined)
    		},
    		onDragOver: (_, ev) => {
    			if (ev.ctrlKey)
    				return "Link entities"
    			if (ev.shiftKey)
    				return "Copy into"
    			return "Drop on collection (CTRL to link, SHIFT to copy and link)"
    		}
    	})

    	EntityHierarchyService.registerListener(ID, updateHierarchy)
    })

    onDestroy(() => {
    	HotKeysController.unbindAction(ref)
    	draggable.onDestroy()
    })
</script>

<Header
        setFilteredComponent={v => filteredComponent =v}
        setSearch={v => search = v}
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
                {isOnSearch}
                updateOpen={_ => updateHierarchy(openTree)}
                {openTree}
                {toRender}
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