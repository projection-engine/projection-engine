<script>
    import FilesAPI from "../../../../shared/libs/files/FilesAPI"
    import handleDropFolder from "../utils/handle-drop-folder"
    import Input from "../../../../shared/components/input/Input.svelte";
    import FILE_TYPES from "../../../../static/FILE_TYPES";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import Preview from "../../../../shared/components/preview/Preview.svelte";
    import FilesStore from "../../../stores/FilesStore";
    import Localization from "../../../../shared/libs/Localization";
    import EngineStore from "../../../stores/EngineStore";
    import {onDestroy, onMount} from "svelte";
    import dragDrop from "../../../../shared/components/drag-drop/drag-drop";
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte";
    import getTypeName from "../utils/get-type-name";
    import SelectionStore from "../../../stores/SelectionStore";

    const {shell} = window.require("electron")

    export let childrenQuantity
    export let reset
    export let type
    export let data

    export let setSelected
    export let onRename
    export let submitRename
    export let items
    export let setCurrentDirectory
    export let currentDirectory
    export let setOnDrag
    export let onDrag

    let ref
    let selected
    const unsubscribe = SelectionStore.getStore(() => selected = SelectionStore.map)
    let currentLabel
    $: currentLabel = data.name

    $: metadata = {
        path: FilesAPI.path + FilesAPI.sep + "previews" + FilesAPI.sep + data.registryID + FILE_TYPES.PREVIEW,
        type: data.type ? "." + data.type : "folder",
        childrenQuantity,
        typeName: getTypeName(data.type)
    }
    const translate = key => Localization.PROJECT.FILES[key]
    const onDbClick = () => {
        if (type === 1) {
            const fileType = "." + data.type
            if (fileType === FILE_TYPES.COMPONENT || fileType === FILE_TYPES.STYLESHEET || fileType === FILE_TYPES.UI_LAYOUT) {
                shell.openPath(FilesStore.ASSETS_PATH + FilesAPI.sep + data.id).catch()
                alert.pushAlert(translate("OPENING_FILE") + " (" + currentLabel + ")", "info")
            } else if (fileType === FILE_TYPES.LEVEL) {
                alert.pushAlert(translate("OPENING_LEVEL") + " (" + currentLabel + ")", "info")
                EngineStore.loadLevel(data)
            } else
                setSelected(data.id)
        } else {
            reset()
            setCurrentDirectory(data)
        }
    }
    $: isMaterial = metadata.type === FILE_TYPES.MATERIAL
    let icon
    $: {
        if (type === 0)
            icon = childrenQuantity === 0 ? "folder_open" : "folder"
        else
            switch (metadata.type) {
                case FILE_TYPES.COMPONENT:
                    icon = "extension"
                    break
                case FILE_TYPES.SCENE:
                    icon = "inventory_2"
                    break
                case FILE_TYPES.STYLESHEET:
                    icon = "css"
                    break
                case FILE_TYPES.LEVEL:
                    icon = "forest"
                    break
                case FILE_TYPES.UI_LAYOUT:
                    icon = "view_quilt"
                    break
                case FILE_TYPES.MATERIAL_INSTANCE:
                    icon = "tune"
                    break

                default:
                    icon = undefined
                    break
            }
    }
    const getIcon = () => {
        if (icon)
            return icon
        if (type === 0)
            return childrenQuantity === 0 ? "folder_open" : "folder"
        if (metadata.type === FILE_TYPES.MESH)
            return "category"
        return "texture"

    }
    const draggable = dragDrop(true)
    $: isNotDraggable = onDrag && type !== 0
    $: dragDropData = {
        dragImage: `
                <span data-icon="-" style="font-size: 70px">${getIcon()}</span>
                ${data.name}
            `,
        onDragOver: () => type === 0 ? "Link folder" : undefined,
        onDragStart: () => {
            setOnDrag(true)
            const ss = SelectionStore.contentBrowserSelected.map(s => items.find(i => i.id === s))
            if (ss.length > 0)
                return JSON.stringify(ss.map(s => s.registryID))
            return JSON.stringify([type === 1 ? data.registryID : data.id])
        }
    }

    onMount(() => {
        draggable.onMount({
            targetElement: ref,
            onDrop: (event) => handleDropFolder(event, data.id, currentDirectory, setCurrentDirectory),
            ...dragDropData
        })
    })
    $: {
        draggable.dragImage = dragDropData.dragImage
        draggable.onDragOver = dragDropData.onDragOver
        draggable.onDragStart = dragDropData.onDragStart
        draggable.disabled = onDrag && type !== 0
    }


    onDestroy(() => {
        unsubscribe()
        draggable.onDestroy()
    })
    $: isOnRename = onRename === data.id

    $: draggable.disabled = isOnRename
    let toolTipContent
    $: {
        let body
        if (type !== 0)
            body = `
        <div>
            <strong>${translate("ITEM_TYPE")}:</strong>
            <small>${metadata.typeName}</small>
        </div>
        <div>
            <strong>${translate("REGISTRY_ID")}:</strong>
            <small>${data.registryID}</small>
        </div>
`
        else
            body = `
            <div>
                <strong>${translate("CHILDREN")}:</strong>
                <small>${childrenQuantity}</small>
            </div>
`
        toolTipContent = `
         <div style="   display: grid;">
            <div>
                <strong>${translate("ITEM_NAME")}: </strong>
                <small>${currentLabel}</small>
            </div>
            ${body}
        </div>
        `
    }

</script>

<div
        data-material={isMaterial ? data.id : undefined}
        data-file={type === 0 ? undefined : data.id}
        data-name={currentLabel}
        data-folder={type !== 0 ? undefined : data.id}
        on:dblclick={onDbClick}
        bind:this={ref}
        on:click={setSelected}
        style={selected.get(data.id) && !isOnRename? "background: var(--pj-accent-color-light);" : (isOnRename ? "background: transparent;" : "") +  (FilesStore.toCut.includes(data.id) || isNotDraggable ? "opacity: .5;" : "")}
        class="file"

>

    {#if icon != null}
        <div class="icon">
            <Icon styles={(data.isFolder ? "color: var(--folder-color);" : "") + "font-size: 3.5rem; "}>{icon}</Icon>
        </div>
    {:else}
        <div class="icon">
            <Preview path={metadata.path}>
                <img class="image" slot="image" alt="logo" let:src src={src}>
                <Icon slot="icon" styles="font-size: 4rem">
                    {#if metadata.type === FILE_TYPES.MESH}
                        category
                    {:else}
                        texture
                    {/if}
                </Icon>
            </Preview>
        </div>
    {/if}
    {#if isOnRename}
        <Input
                hasBorder="true"
                onEnter={() => submitRename(currentLabel)}
                onBlur={() => submitRename(currentLabel)}
                setSearchString={e => currentLabel = e}
                searchString={currentLabel}
                noAutoSubmit="true"
        />
    {:else }
        <div data-overflow="-" class="label">
            {currentLabel}
        </div>
    {/if}
    <ToolTip content={toolTipContent}/>
</div>

<style>

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
        max-height: 100%;
    }

    .label {
        font-size: 0.75rem;
        padding: 4px 4px 8px;
        text-align: center;
        line-height: 100%;
        min-height: 20px;
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
