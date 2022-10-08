<script>
    import dragDrop from "../../../../shared/components/drag-drop/drag-drop";
    import {onDestroy, onMount} from "svelte";
    import handleDropFolder from "../utils/handle-drop-folder";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import NodeFS from "shared-resources/frontend/libs/NodeFS";

    export let setCurrentDirectory
    export let currentDirectory
    export let id
    export let name
    $: isTopLevel = id === NodeFS.sep
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

    onDestroy(() => draggable.onDestroy())
</script>


<button
        bind:this={ref}
        data-highlight={isCurrentDir && !isTopLevel ? "-" : undefined}
        class="folder"
        on:click={() => setCurrentDirectory({id})}
>
    <Icon styles={isTopLevel ? "" : "color: var(--folder-color)"}>
        {#if isTopLevel }
            arrow_upward
        {:else}
            folder
        {/if}
    </Icon>
    {name}
</button>

<style>
    .folder {
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