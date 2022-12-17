<script>
    import handleDropFolder from "../../utils/handle-drop-folder"
    import FilesStore from "../../../../stores/FilesStore";
    import {onDestroy, onMount} from "svelte";
    import dragDrop from "../../../../components/drag-drop/drag-drop";
    import getTypeName from "../../utils/get-type-name";
    import getItemDragImage from "../../utils/get-item-dragimage";
    import getItemIcon from "../../utils/get-item-icon";
    import getItemDragData from "../../utils/get-item-drag-data";
    import Card from "./Card.svelte";
    import ITEM_TYPES from "../../templates/ITEM_TYPES";
    import Row from "./Row.svelte";
    import PROJECT_FOLDER_STRUCTURE from "../../../../../../static/PROJECT_FOLDER_STRUCTURE";
    import FILE_TYPES from "../../../../../../static/FILE_TYPES";
    import NodeFS from "../../../../../shared/libs/NodeFS";
    import ToolTip from "../../../../../shared/components/tooltip/ToolTip.svelte";


    export let childQuantity
    export let reset
    export let type
    export let data
    export let selectionMap
    export let setSelected
    export let submitRename
    export let items
    export let setCurrentDirectory
    export let currentDirectory
    export let setOnDrag
    export let onDrag
    export let toCut = []
    export let onRename
    export let viewType

    let ref

    const draggable = dragDrop(true)

    $: isOnRename = onRename === data.id
    $: isMaterial = metadata.type === FILE_TYPES.MATERIAL
    $: isNotDraggable = onDrag && type !== 0
    $: icon = getItemIcon(metadata, childQuantity, type)
    $: isOnCuttingBoard = toCut.includes(data.id)
    $: metadata = {
        path: NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.PREVIEWS + NodeFS.sep + data.registryID + FILE_TYPES.PREVIEW,
        type: data.type ? "." + data.type : "folder",
        childQuantity,
        typeName: getTypeName(data.type)
    }

    $: {
        const dragDropData = getItemDragData(icon, childQuantity, data, items, setOnDrag, type, metadata)
        draggable.dragImage = dragDropData.dragImage
        draggable.onDragOver = dragDropData.onDragOver
        draggable.onDragStart = dragDropData.onDragStart
        draggable.disabled = onDrag && type !== 0 || isOnRename
    }

    $: toolTipContent = getItemDragImage(childQuantity, data, type, metadata)
    $: if (isOnRename) FilesStore.updateStore({...FilesStore.data, toCut: []})
    onMount(() => {
        const dragDropData = getItemDragData(icon, childQuantity, data, items, setOnDrag, type, metadata)
        draggable.onMount({
            targetElement: ref,
            onDrop: (event) => handleDropFolder(event, data.id, currentDirectory, setCurrentDirectory),
            ...dragDropData
        })
    })

    onDestroy(() => draggable.onDestroy())

    $: props = {
        data,
        isNotDraggable,
        setCurrentDirectory,
        setSelected,
        reset,
        type,
        isMaterial,
        isOnRename,
        isOnCuttingBoard,
        metadata,
        submitRename,
        toolTipContent,
        draggable,
        icon,
        childQuantity,
        currentDirectory,
        items,
        setOnDrag,
        selected: selectionMap
    }
    $: isCard = viewType === ITEM_TYPES.CARD
</script>

<span bind:this={ref} style={isCard ? undefined : "width: 100%"}>
    {#if isCard}
        <Card {...props}/>
        {:else}
        <Row {...props}/>
    {/if}
    <ToolTip content={toolTipContent}/>
</span>

 