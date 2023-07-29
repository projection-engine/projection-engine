<script>
    import {onDestroy, onMount} from "svelte"
    import dragDrop from "../../../../../shared/components/drag-drop/drag-drop"
    import Card from "./Card.svelte"
    import Row from "./Row.svelte"
    import ToolTip from "../../../../../shared/components/tooltip/ToolTip.svelte"
    import FileTypes from "../../../../../../../shared/enums/FileTypes"
    import Folders from "../../../../../../../shared/enums/Folders"
    import ContentBrowserUtil from "../../../../util/ContentBrowserUtil"
    import FileSystemUtil from "../../../../../shared/FileSystemUtil"
    import ContentBrowserStore from "../../../../../shared/stores/ContentBrowserStore";

    export let reset
    export let data
    export let submitRename
    export let setCurrentDirectory
    export let setOnDrag
    export let onDrag
    export let isOnRename
    export let isCardViewType
    export let selectedItems
    export let toCut

    const COMPONENT_ID = crypto.randomUUID()
    let isFolder = data.isFolder
    let isSelected = false
    $: isSelected = selectedItems.includes(data)
    const draggable = dragDrop(true)

    $: isFolder = data.isFolder
    $: itemMetadata = {
    	path: FileSystemUtil.path + FileSystemUtil.sep + Folders.PREVIEWS + FileSystemUtil.sep + data.registryID + FileTypes.PREVIEW,
    	type: data.type ? "." + data.type : "folder",
    	childQuantity:data.children,
    	typeName: ContentBrowserUtil.getTypeName(data.type)
    }
    $: {
    	const dragDropData = ContentBrowserUtil.getItemDragData(data, setOnDrag)
    	draggable.dragImage = dragDropData.dragImage
    	draggable.onDragOver = dragDropData.onDragOver
    	draggable.onDragStart = dragDropData.onDragStart
    	draggable.disabled = (onDrag && !isFolder) || isOnRename
    	if (isOnRename) ContentBrowserUtil.cutFiles([])
    }

    $: props = {
    	data,
    	isNotDraggable: onDrag && !isFolder,
    	setCurrentDirectory,
    	reset,
    	isOnRename,
    	metadata: itemMetadata,
    	submitRename,
    	icon: ContentBrowserUtil.getItemIcon(data),
    	setOnDrag,
    	isSelected,
    	isToBeCut: toCut != null && toCut.includes(data.id)
    }

    onMount(() => {
    	draggable.onMount({
    		targetElement: document.getElementById(COMPONENT_ID),
    		onDrop: (event) => ContentBrowserUtil.handleDropFolder(event, data.id)
    	})
    })

    onDestroy(() => {
        draggable.onDestroy()
        ContentBrowserStore.getInstance().removeListener(COMPONENT_ID)
    })
</script>

<span id={COMPONENT_ID} style={isCardViewType ? undefined : "width: 100%"}>
    {#if isCardViewType}
        <Card {...props}/>
        {:else}
        <Row {...props}/>
    {/if}
    <ToolTip content={ContentBrowserUtil.getItemDragImage(data)}/>
</span>

