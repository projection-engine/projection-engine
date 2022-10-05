<script>
    import FilesAPI from "../../../../shared/libs/FilesAPI"
    import handleDropFolder from "../utils/handle-drop-folder"
    import Input from "../../../../shared/components/input/Input.svelte";
    import FILE_TYPES from "../../../../static/FILE_TYPES";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import Preview from "../../../../shared/components/preview/Preview.svelte";
    import FilesStore from "../../../stores/FilesStore";
    import Localization from "../../../../shared/libs/Localization";
    import {onDestroy, onMount} from "svelte";
    import dragDrop from "../../../../shared/components/drag-drop/drag-drop";
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte";
    import getTypeName from "../utils/get-type-name";
    import SelectionStore from "../../../stores/SelectionStore";
    import LevelController from "../../../libs/LevelController";
    import itemDbclick from "../utils/item-dbclick";
    import ItemInput from "./ItemInput.svelte";
    import getIcon from "../utils/get-icon";
    import getItemDragImage from "../utils/get-item-dragimage";
    import getItemIcon from "../utils/get-item-icon";
    import getItemDragData from "../utils/get-item-drag-data";

    export let childrenQuantity
    export let reset
    export let type
    export let data

    export let setSelected
    export let submitRename
    export let items
    export let setCurrentDirectory
    export let currentDirectory
    export let setOnDrag
    export let onDrag
    export let toCut = []
    export let onRename


    let ref
    let selected
    const unsubscribe = SelectionStore.getStore(() => selected = SelectionStore.map)
    const translate = key => Localization.PROJECT.FILES[key]
    const draggable = dragDrop(true)

    $: isOnRename = onRename === data.id
    $: isMaterial = metadata.type === FILE_TYPES.MATERIAL
    $: isNotDraggable = onDrag && type !== 0
    $: icon = getItemIcon(metadata, childrenQuantity, type)
    $: isOnCuttingBoard = toCut.includes(data.id)
    $: metadata = {
        path: FilesAPI.path + FilesAPI.sep + "previews" + FilesAPI.sep + data.registryID + FILE_TYPES.PREVIEW,
        type: data.type ? "." + data.type : "folder",
        childrenQuantity,
        typeName: getTypeName(data.type)
    }


    $: {
        const dragDropData = getItemDragData(icon, childrenQuantity, data, items, setOnDrag, type, metadata)
        draggable.dragImage = dragDropData.dragImage
        draggable.onDragOver = dragDropData.onDragOver
        draggable.onDragStart = dragDropData.onDragStart
        draggable.disabled = onDrag && type !== 0 || isOnRename
    }

    $: toolTipContent = getItemDragImage(childrenQuantity, data, type, metadata)
    $: if (isOnRename) FilesStore.updateStore({...FilesStore.data, toCut: []})
    onMount(() => {
        const dragDropData = getItemDragData(icon, childrenQuantity, data, items, setOnDrag, type, metadata)
        draggable.onMount({
            targetElement: ref,
            onDrop: (event) => handleDropFolder(event, data.id, currentDirectory, setCurrentDirectory),
            ...dragDropData
        })
    })

    onDestroy(() => {
        unsubscribe()
        draggable.onDestroy()
    })

</script>

<div
        data-isitem="-"
        data-id={data.id}
        data-material={isMaterial ? data.id : undefined}
        data-file={type === 0 ? undefined : data.id}
        data-name={data.name}
        data-folder={type !== 0 ? undefined : data.id}
        on:dblclick={() => itemDbclick(data, setCurrentDirectory, setSelected, reset, type)}
        bind:this={ref}
        on:click={setSelected}
        style={(selected.get(data.id) && !isOnRename? "background: var(--pj-accent-color-light);" : (isOnRename ? "background: transparent;" : "")) +  (isOnCuttingBoard || isNotDraggable ? "opacity: .5;" : "")}
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
    <ToolTip content={toolTipContent}/>
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
        backdrop-filter: blur(5px) brightness(85%);

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
