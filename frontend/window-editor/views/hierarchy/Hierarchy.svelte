<script>
    import LOCALIZATION_EN from "../../../../static/objects/LOCALIZATION_EN";
    import Tree from "./components/Tree.svelte";
    import {onDestroy, onMount} from "svelte";
    import HotKeysController from "../../../shared/lib/HotKeysController";
    import dragDrop from "../../../shared/components/drag-drop/drag-drop";
    import HierarchyController from "../../lib/controllers/HierarchyController";
    import SettingsStore from "../../../shared/stores/SettingsStore";
    import viewportHotkeys from "../../templates/viewport-hotkeys";
    import Engine from "../../../../engine-core/Engine";
    import handleDrop from "./utils/handle-drop";
    import Header from "./components/Header.svelte";
    import buildTree from "./utils/build-tree";
    import testSearch from "./utils/test-search";

    let search = ""
    const ID = crypto.randomUUID()

    let filteredComponent = undefined
    let ref
    let settings
    let openTree = {}
    let toRender = []
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)

    $: {
        if (ref != null) {
            HotKeysController.bindAction(
                ref,
                Object.values(viewportHotkeys(settings)),
                "public",
                LOCALIZATION_EN.VIEWPORT
            )
        }
    }

    const draggable = dragDrop()



    function updateHierarchy(op) {
        const openLocal = op ?? openTree
        if (op !== openTree && op !== undefined)
            HierarchyController.updateHierarchy()
        openTree = openLocal
        toRender = buildTree(openTree, search, filteredComponent)
    }

    onMount(() => {
        draggable.onMount({
            targetElement: ref,
            onDrop: (entityDragged, event) => {
                const node = event.composedPath().find(n => n?.getAttribute?.("data-sveltenode") != null)?.getAttribute?.("data-sveltenode")
                handleDrop(event, entityDragged, node ? Engine.entities.get(node) : undefined)
            },
            onDragOver: (_, ev) => {
                if (ev.ctrlKey)
                    return `Link entities`;
                if (ev.shiftKey)
                    return `Copy into`;
                return `Drop on collection (CTRL to link, SHIFT to copy and link)`
            }
        })

        HierarchyController.registerListener(ID, updateHierarchy)
    })

    $: {
        search
        filteredComponent
        updateHierarchy()
    }
    onDestroy(() => {
        HotKeysController.unbindAction(ref)
        unsubscribeSettings()
        draggable.onDestroy()
    })
    $: isOnSearch = search || filteredComponent


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
                testSearch={node => testSearch(filteredComponent, search, node)}
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

        background: repeating-linear-gradient(
                to bottom,
                var(--pj-background-secondary) 0px,
                var(--pj-background-secondary) 23px,
                var(--pj-background-tertiary) 23px,
                var(--pj-background-tertiary) 46px
        );
    }
</style>