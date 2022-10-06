<script>
    import FilesAPI from "../../../../../shared/libs/FilesAPI"
    import handleDropFolder from "../../utils/handle-drop-folder"
    import Input from "../../../../../shared/components/input/Input.svelte";
    import FILE_TYPES from "../../../../../static/FILE_TYPES";
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import Preview from "../../../../../shared/components/preview/Preview.svelte";
    import FilesStore from "../../../../stores/FilesStore";
    import Localization from "../../../../../shared/libs/Localization";
    import {onDestroy, onMount} from "svelte";
    import dragDrop from "../../../../../shared/components/drag-drop/drag-drop";
    import ToolTip from "../../../../../shared/components/tooltip/ToolTip.svelte";
    import getTypeName from "../../utils/get-type-name";
    import SelectionStore from "../../../../stores/SelectionStore";
    import LevelController from "../../../../libs/LevelController";
    import itemDbclick from "../../utils/item-dbclick";
    import ItemInput from "./ItemInput.svelte";
    import getIcon from "../../utils/get-icon";
    import getItemDragImage from "../../utils/get-item-dragimage";
    import getItemIcon from "../../utils/get-item-icon";
    import getItemDragData from "../../utils/get-item-drag-data";
    import Card from "./Card.svelte";

    export let childrenQuantity
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

    let ref

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
        childrenQuantity,
        currentDirectory,
        items,
        setOnDrag,
        selected: selectionMap
    }
</script>

<span bind:this={ref}>
    <Card {...props}/>
    <ToolTip content={toolTipContent}/>
</span>

 