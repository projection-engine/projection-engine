<script>
    import SideBarItem from "./SideBarItem.svelte";
    import NodeFS from "frontend/shared/libs/NodeFS";
    import VirtualList from '@sveltejs/svelte-virtual-list';
    import FilesHierarchyStore from "../../../stores/FilesHierarchyStore";
    import {onDestroy} from "svelte";

    export let setCurrentDirectory = undefined
    export let currentDirectory = undefined
    let assets = []
    let open = {}
    const unsubscribe = FilesHierarchyStore.getStore(v => {
        assets = v.items
        open = v.open
    })
    onDestroy(() => unsubscribe())
</script>

<div class="wrapper">
    <VirtualList items={assets} let:item>
        <SideBarItem
                triggerOpen={_ => {
                    let open = FilesHierarchyStore.data.open
                    const inv = !open[item.item.id]
                    if(item.item.id === NodeFS.sep && !inv)
                        open = {}
                    else if(!inv){
                        for(let i =0; i < item.children.length; i++)
                            delete open[item.children[i]]
                    }
                    open[item.item.id] = inv
                    FilesHierarchyStore.data.open = open
                    FilesHierarchyStore.update()
                }}
                open={open}
                childQuantity={item.childQuantity}
                depth={item.depth}
                setCurrentDirectory={setCurrentDirectory}
                currentDirectory={currentDirectory}
                id={item.item.id}
                name={item.item.name}
        />
    </VirtualList>
</div>

<style>
    .wrapper {
        display: grid;
        gap: 2px;
        overflow-y: auto;
        width: 300px;
        padding-left: 3px;
        padding-right: 3px;

    }
</style>
