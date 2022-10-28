<script>
    import SideBarItem from "./SideBarItem.svelte";
    import NodeFS from "shared-resources/frontend/libs/NodeFS";

    export let setCurrentDirectory = undefined
    export let items = undefined
    export let currentDirectory = undefined

    $: assets = items.filter(item => item.isFolder && !item.parent)
</script>

<div class="wrapper">
    <SideBarItem
            setCurrentDirectory={setCurrentDirectory}
            currentDirectory={currentDirectory}
            id={NodeFS.sep}
            name={"..."}
    />
    {#each assets as b}
        <SideBarItem
                setCurrentDirectory={setCurrentDirectory}
                currentDirectory={currentDirectory}
                id={b.id}
                name={b.name}
        />
    {/each}
</div>

<style>
    .wrapper {
        display: grid;
        align-content: flex-start;
        gap: 2px;
        overflow-y: auto;
        width: 300px;
        padding-left: 3px;
        padding-right: 3px;

    }
</style>
