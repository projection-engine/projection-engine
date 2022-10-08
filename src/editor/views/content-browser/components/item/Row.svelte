<script>
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import Preview from "../../../../../shared/components/preview/Preview.svelte";
    import ItemInput from "./ItemInput.svelte";
    import itemDbclick from "../../utils/item-dbclick";
    import FILE_TYPES from "shared-resources/FILE_TYPES";

    export let currentDirectory
    export let items
    export let data
    export let setCurrentDirectory
    export let setSelected
    export let reset
    export let type
    export let isMaterial
    export let isOnRename
    export let selected
    export let metadata
    export let submitRename
    export let icon
    export let draggable
    export let isOnCuttingBoard
    export let isNotDraggable

</script>

<div
        data-isitem="-"
        data-id={data.id}
        data-material={isMaterial ? data.id : undefined}
        data-file={type === 0 ? undefined : data.id}
        data-name={data.name}
        data-folder={type !== 0 ? undefined : data.id}
        on:dblclick={() => itemDbclick(data, setCurrentDirectory, setSelected, reset, type)}
        on:click={setSelected}
        style={(selected.get(data.id) && !isOnRename? "background: var(--pj-accent-color-light);" : (isOnRename ? "background: transparent; box-shadow: none;" : "")) +  (isOnCuttingBoard || isNotDraggable ? "opacity: .5;" : "")}
        class="file"
>
    <div class="icon">
        {#if icon != null}
            <Icon styles={(data.isFolder ? "color: var(--folder-color);" : "") + "font-size: 1rem; "}>{icon}</Icon>
        {:else if metadata.type === FILE_TYPES.SIMPLE_MATERIAL || metadata.type === FILE_TYPES.MATERIAL || metadata.type === FILE_TYPES.MATERIAL_INSTANCE || metadata.type === FILE_TYPES.TERRAIN_MATERIAL}
            <div data-shaded-material="-" style="width: 20px; height: 20px"></div>
            {#if metadata.type !== FILE_TYPES.MATERIAL}
                <div class="file-type">
                    <Icon styles="font-size: .8rem">
                        {#if metadata.type === FILE_TYPES.MATERIAL_INSTANCE }
                            copy_all
                        {:else if metadata.type === FILE_TYPES.SIMPLE_MATERIAL}
                            fast_forward
                        {:else if metadata.type === FILE_TYPES.TERRAIN_MATERIAL}
                            landscape
                        {/if}
                    </Icon>
                </div>
            {/if}
        {:else if metadata.type === FILE_TYPES.MESH || metadata.type === FILE_TYPES.TEXTURE}
            <Preview path={metadata.path}>
                <img class="image" slot="image" alt="logo" let:src src={src}>
                <Icon slot="icon" styles="font-size: 1rem">
                    {#if metadata.type === FILE_TYPES.MESH}
                        category
                    {:else}
                        image
                    {/if}
                </Icon>
            </Preview>
        {/if}
    </div>

    <ItemInput data={data} submitRename={submitRename} isOnRename={isOnRename} isRow={true}/>

    <small>{data.creationDate}</small>
    {#if !data.isFolder}
        <small>{(data.size / 1e+6).toFixed(2)}mb</small>
    {/if}
</div>

<style>
    small{
        font-size: .65rem;
    }
    .image {
        max-height: 100%;
        overflow: hidden;
    }

    .file {
        width: 100%;
        height: 23px;
        max-height: 23px;
        overflow: hidden;
        display: grid;
        align-items: center;
        grid-auto-flow: column;
        grid-template-columns: 30px calc(80% - 30px) 10% 10%;
        gap: 4px;
    }

    .file:hover {
        border-color: transparent;
        background: var(--pj-background-primary);
        box-shadow: var(--pj-boxshadow);
    }

    .icon {
        position: relative;
        max-height: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .file-type {
        position: absolute;
        right: 0;
        bottom: 0;
        opacity: .85;
        border-radius: 3px;
        backdrop-filter: blur(1px) brightness(95%);

        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>