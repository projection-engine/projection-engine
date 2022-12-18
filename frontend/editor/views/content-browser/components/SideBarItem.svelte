<script>
    import dragDrop from "../../../components/drag-drop/drag-drop";
    import {onDestroy, onMount} from "svelte";
    import handleDropFolder from "../utils/handle-drop-folder";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    export let depth
    export let setCurrentDirectory
    export let currentDirectory
    export let id
    export let name
    export let open
    export let triggerOpen
    export let childQuantity
    $: isCurrentDir = currentDirectory.id === id
    let ref


    const draggable = dragDrop(false)
    onMount(() => {
        draggable.onMount({
            targetElement: ref,
            onDrop: (event) => handleDropFolder(event, id),
            onDragOver: () => "Link folder"
        })
    })

    $: isOpen = open[id]
    onDestroy(() => draggable.onDestroy())
</script>


<div
        data-selected={isCurrentDir ? "-" : undefined}
        bind:this={ref}
        class="wrapper hierarchy-branch"
        style={`padding-left: ${depth * 18}px;`}
>
    {#if childQuantity > 0}
        <button
                data-open={isOpen ? "-" : ""}
                class="button-small hierarchy-branch"
                on:click={triggerOpen}
        >
            <Icon>arrow_drop_down</Icon>
        </button>
    {:else}
        <div class="button-small hierarchy-branch"></div>
    {/if}
    <button
            bind:this={ref}
            class="folder"
            on:click={() => setCurrentDirectory({id})}
    >
        <Icon styles={"color: var(--folder-color)"}>folder</Icon>
        {name}
    </button>
</div>
<style>
    .folder {
        background: none;
        width: 100%;
        border: none;
        height: 20px;
        font-size: 0.7rem;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 4px;
        cursor: pointer;
    }
</style>