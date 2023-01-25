<script>
    import Preview from "../../../../../../components/preview/Preview.svelte";
    import ItemInput from "./ItemInput.svelte";
    import openItem from "../../utils/open-item";
    import Icon from "../../../../../../components/icon/Icon.svelte";
    import FILE_TYPES from "../../../../../../../static/objects/FILE_TYPES";

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
        data-svelteisitem="-"
        data-svelteid={data.id}
        data-sveltematerial={isMaterial ? data.id : undefined}
        data-sveltefile={type === 0 ? undefined : data.id}
        data-sveltename={data.name}
        data-sveltefolder={type !== 0 ? undefined : data.id}
        on:dblclick={() => openItem(data, setCurrentDirectory, setSelected, reset, type)}
        on:click={setSelected}
        style={(selected.get(data.id) && !isOnRename? "background: var(--pj-accent-color-light);" : (isOnRename ? "background: transparent; box-shadow: none;" : "")) +  (isOnCuttingBoard || isNotDraggable ? "opacity: .5;" : "")}
        class="file"
>
    <div class="icon">
        {#if icon != null}
            <Icon styles={(data.isFolder ? "color: var(--folder-color);" : "") + "font-size: 1rem; "}>{icon}</Icon>
        {:else if metadata.type === FILE_TYPES.MATERIAL}
            <div data-svelteshaded-material="-" style="width: 20px; height: 20px"></div>
        {:else if metadata.type === FILE_TYPES.PRIMITIVE || metadata.type === FILE_TYPES.TEXTURE}
            <Preview path={metadata.path}>
                <img class="image" slot="image" alt="logo" let:src src={src}>
                <Icon slot="icon" styles="font-size: 1rem">
                    {#if metadata.type === FILE_TYPES.PRIMITIVE}
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
        width: 30px;
        position: relative;
        max-height: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>