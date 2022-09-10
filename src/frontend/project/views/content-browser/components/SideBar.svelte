<script>
    import FilesAPI from "../../../../libs/files/FilesAPI"
    import Icon from "../../../../components/icon/Icon.svelte";
    import Accordion from "../../../../components/accordion/Accordion.svelte";

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
        <div
                data-highlight={currentDirectory.id === FilesAPI.sep ? "-" : undefined}
                class="folder"
                on:click={() => setCurrentDirectory({id: FilesAPI.sep})}
        >
            <Icon styles={{fontSize: "1.1rem"}}>arrow_upward</Icon>
            ...
        </div>
        {#each assets as b, i}
            <div
                    data-highlight={b.id === currentDirectory.id ? "-" : undefined}
                    class="folder"
                    on:click={() => setCurrentDirectory(b)}
            >
                <Icon styles="color: var(--folder-color)">
                    folder
                </Icon>
                {b.name}
            </div>
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
            <div
                    class="folder"
                    on:click={() => setCurrentDirectory({id: b.path})}
            >

                <Icon styles="color: var(--folder-color)">
                    folder
                </Icon>
                {b.name}
            </div>
        {/each}
    </Accordion>
</div>

<style>
    .wrapper{
        display: grid;
        align-content: flex-start;
        gap: 2px;
        overflow-y: auto;
        width: 300px;
        padding: 0 4px;
        background: var(--pj-background-secondary);
    }


    .summary {
        font-size: 0.7rem;
        gap: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    .folder {
        height: 20px;
        font-size: 0.7rem;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 4px;
        cursor: pointer;
    }
</style>
