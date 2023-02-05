<script>
    import LOCALIZATION_EN from "../../../shared/static/LOCALIZATION_EN";
    import Tree from "./components/Tree.svelte";
    import {onDestroy, onMount} from "svelte";
    import HotKeysController from "../../../shared/lib/HotKeysController";
    import dragDrop from "../../../shared/components/drag-drop/drag-drop";
    import HierarchyController from "./lib/HierarchyController";
    import SettingsStore from "../../../shared/stores/SettingsStore";
    import viewportHotkeys from "../../templates/viewport-hotkeys";
    import Engine from "../../../../engine-core/Engine";
    import handleDrop from "./utils/handle-drop";
    import Header from "./components/Header.svelte";
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
        if (op !== undefined) {
            openTree = openLocal
            HierarchyController.updateHierarchy()
        }
        const entities = Engine.entities.array
        const hierarchy = HierarchyController.hierarchy
        const data = []

        if (!search && !filteredComponent)
            for (let i = 0; i < hierarchy.length; i++) {
                const current = hierarchy[i]
                if (!current.node.parent || openLocal[current.node.parent.id])
                    data.push(current)
            }
        else
            for (let i = 0; i < entities.length; i++) {
                if (testSearch(entities[i], filteredComponent, search))
                    data.push({node: entities[i], depth: 0})
            }
        toRender = data
    }

    onMount(() => {
        draggable.onMount({
            targetElement: ref,
            onDrop: (entityDragged, event) => {
                const node = event.composedPath().find(n => n?.getAttribute?.("data-sveltenode") != null)?.getAttribute?.("data-sveltenode")
                handleDrop(event, entityDragged, node ? Engine.entities.map.get(node) : undefined)
            },
            onDragOver: (_, ev) => {
                if (ev.ctrlKey)
                    return `Drop to make child`;
                if (ev.shiftKey)
                    return `Drop to clone into...`;
                return `CTRL to parent | SHIFT to clone`
            }
        })

        HierarchyController.registerListener(ID, updateHierarchy)
    })

    onDestroy(() => {
        HotKeysController.unbindAction(ref)
        unsubscribeSettings()
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
    <Tree
            updateOpen={_ => updateHierarchy(openTree)}
            {openTree}
            {toRender}
            {filteredComponent}
            {ID}
    />
</div>


<style>
    .wrapper {
        position: relative;
        width: 100%;
        overflow: hidden;
        height: 100%;
        max-height: 100%;
    }
</style>