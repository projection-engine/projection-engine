<script>
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import Preview from "../../../../../shared/components/preview/Preview.svelte";
    import ItemInput from "./ItemInput.svelte";
    import ToolTip from "../../../../../shared/components/tooltip/ToolTip.svelte";
    import itemDbclick from "../../utils/item-dbclick";
    import FILE_TYPES from "../../../../../static/FILE_TYPES";

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
            <Icon styles={(data.isFolder ? "color: var(--folder-color);" : "") + "font-size: 3.5rem; "}>{icon}</Icon>
        {:else if metadata.type === FILE_TYPES.SIMPLE_MATERIAL || metadata.type === FILE_TYPES.MATERIAL || metadata.type === FILE_TYPES.MATERIAL_INSTANCE || metadata.type === FILE_TYPES.TERRAIN_MATERIAL}
            <div data-shaded-material="-" style="width: 60px; height: 60px"></div>
            {#if metadata.type !== FILE_TYPES.MATERIAL}
                <div class="file-type">
                    <Icon styles="font-size: 1.3rem">
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
                <Icon slot="icon" styles="font-size: 4rem">
                    {#if metadata.type === FILE_TYPES.MESH}
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
