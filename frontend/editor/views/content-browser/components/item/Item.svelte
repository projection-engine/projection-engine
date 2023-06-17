<script>
    import handleDropFolder from "../../utils/handle-drop-folder"
    import FilesStore from "../../../../../shared/stores/FilesStore"
    import {onDestroy, onMount} from "svelte"
    import dragDrop from "../../../../../shared/components/drag-drop/drag-drop"
    import getTypeName from "../../utils/get-type-name"
    import getItemDragImage from "../../utils/get-item-dragimage"
    import getItemIcon from "../../utils/get-item-icon"
    import getItemDragData from "../../utils/get-item-drag-data"
    import Card from "./Card.svelte"
    import Row from "./Row.svelte"
    import FileSystemUtil from "../../../../../shared/lib/FileSystemUtil"
    import ToolTip from "../../../../../shared/components/tooltip/ToolTip.svelte"
    import FileTypes from "../../../../../../shared/FileTypes"
    import Folders from "../../../../../../shared/Folders"

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
    export let isOnRename
    export let isCardViewType

    let ref

    const draggable = dragDrop(true)

    $: itemMetadata = {
        path: FileSystemUtil.path + FileSystemUtil.sep + Folders.PREVIEWS + FileSystemUtil.sep + data.registryID + FileTypes.PREVIEW,
        type: data.type ? "." + data.type : "folder",
        childQuantity,
        typeName: getTypeName(data.type)
    }
    $: itemIcon = getItemIcon(itemMetadata, type)
    $: {
    	const dragDropData = getItemDragData(itemIcon, childQuantity, data, items, setOnDrag, type, itemMetadata)
    	draggable.dragImage = dragDropData.dragImage
    	draggable.onDragOver = dragDropData.onDragOver
    	draggable.onDragStart = dragDropData.onDragStart
    	draggable.disabled = onDrag && type !== 0 || isOnRename
        if (isOnRename) FilesStore.updateStore({...FilesStore.data, toCut: []})
    }

    $: props = {
    	data,
    	isNotDraggable: onDrag && type !== 0,
    	setCurrentDirectory,
    	setSelected,
    	reset,
    	type,
    	isMaterial: itemMetadata.type === FileTypes.MATERIAL,
    	isOnRename,
        isToBeCut: toCut.includes(data.id),
    	metadata: itemMetadata,
    	submitRename,
    	draggable,
    	icon: itemIcon,
    	childQuantity,
    	currentDirectory,
    	items,
    	setOnDrag,
    	selected: selectionMap
    }

    onMount(() => {
        const dragDropData = getItemDragData(itemIcon, childQuantity, data, items, setOnDrag, type, itemMetadata)
        draggable.onMount({
            targetElement: ref,
            onDrop: (event) => handleDropFolder(event, data.id, currentDirectory, setCurrentDirectory),
            ...dragDropData
        })
    })

    onDestroy(() => draggable.onDestroy())
</script>

<span bind:this={ref} style={isCardViewType ? undefined : "width: 100%"}>
    {#if isCardViewType}
        <Card {...props}/>
        {:else}
        <Row {...props}/>
    {/if}
    <ToolTip content={getItemDragImage(data, type, itemMetadata)}/>
</span>

 