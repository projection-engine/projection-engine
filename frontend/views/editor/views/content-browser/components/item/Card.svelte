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
            <Icon styles={(data.isFolder ? "color: var(--folder-color);" : "") + "font-size: 3.5rem; "}>{icon}</Icon>
        {:else if  metadata.type === FILE_TYPES.MATERIAL}
            <div data-svelteshaded-material="-" style="width: 60px; height: 60px"></div>
        {:else if metadata.type === FILE_TYPES.PRIMITIVE || metadata.type === FILE_TYPES.TEXTURE}
            <Preview path={metadata.path}>
                <img class="image" slot="image" alt="logo" let:src src={src}>
                <Icon slot="icon" styles="font-size: 4rem">
                    {#if metadata.type === FILE_TYPES.PRIMITIVE}
                        category
                    {:else}
                        image
                    {/if}
                </Icon>
            </Preview>
            {#if metadata.type === FILE_TYPES.TEXTURE}
                <div class="file-type">
                    <Icon styles="font-size: 1.3rem">image</Icon>
                </div>
            {/if}
        {/if}
    </div>
    <ItemInput data={data} submitRename={submitRename} isOnRename={isOnRename}/>

</div>

<style>
    .file-type {
        width: 25px;
        height: 25px;

        position: absolute;
        bottom: 3px;
        left: 3px;
        opacity: .85;
        border-radius: 3px;
        background: rgba(0,0,0,.85);

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .icon {
        position: relative;
        color: var(--pj-color-secondary);
        display: flex;
        justify-content: center;
        align-items: center;
        align-content: center;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 5px;
    }

    .image {
        max-width: 100%;
    }

    .file {
        position: relative;
        overflow: hidden;
        border-radius: 5px;
        color: var(--pj-color-secondary);
        gap: 4px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 115px;
        max-width: 115px;
        width: 115px;
        outline: transparent 2px solid;
        cursor: pointer;
        flex: 1 1 80px;
        padding: 4px 4px 0;
    }

    .file:hover {
        border-color: transparent;
        background: var(--pj-background-primary);
        box-shadow: var(--pj-boxshadow);
    }
</style>
