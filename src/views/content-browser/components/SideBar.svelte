<script>
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import Accordion from "../../../components/accordion/Accordion.svelte";
    import SideBarItem from "./SideBarItem.svelte";
    import NodeFS from "shared-resources/frontend/libs/NodeFS";

    export let translate = undefined
    export let bookmarks = undefined
    export let setCurrentDirectory = undefined
    export let items = undefined
    export let currentDirectory = undefined

    $: assets = items.filter(item => item.isFolder && !item.parent)
</script>
<div class="wrapper">
    <Accordion>
        <div class="summary" slot="header">
            <Icon>
                inventory_2
            </Icon>
            {translate("ASSETS")}
        </div>

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
    </Accordion>

    <Accordion>
        <div class="summary" slot="header">
            <Icon>
                book
            </Icon>
            {translate("BOOKMARKS")}
        </div>

        {#each bookmarks as b, i}
            <SideBarItem
                    setCurrentDirectory={setCurrentDirectory}
                    currentDirectory={currentDirectory}
                    id={b.path}
                    name={b.name ? b.name : "..."}
            />
        {/each}
    </Accordion>
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


    .summary {
        width: 100%;
        font-size: 0.7rem;
        gap: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

</style>
