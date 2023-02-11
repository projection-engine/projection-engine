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
        console.trace(search)
        openTree = openLocal

        const hierarchy = HierarchyController.hierarchy
        const data = []

            for (let i = 0; i < hierarchy.length; i++) {
                const current = hierarchy[i]
                let node = current.node

                if (!node ) {
                    if(search || filteredComponent)
                        continue
                    node = current.component.entity
                    if (openLocal[node.id] && openLocal[node.parent.id])
                        data.push(current)
                    continue
                }
                const searchMatches =  (!search || search && node.name.includes(search)) && (!filteredComponent || filteredComponent && node.components.has(filteredComponent))
                if (searchMatches && (!node.parent || openLocal[node.parent?.id]))
                    data.push(current)
            }

        toRender = data
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
    <div class="content">
        <Tree
                {isOnSearch}
                updateOpen={_ => updateHierarchy(openTree)}
                {openTree}
                {toRender}
                {filteredComponent}
                {ID}
        />
    </div>
</div>


<style>
    .wrapper {
        position: relative;
        width: 100%;
        overflow-y: hidden;
        overflow-x: auto;
        height: 100%;
        max-height: 100%;
    }

    .content {
        min-width: 100%;
        width: fit-content;
        overflow: visible;
        height: 100%;
    }
</style>