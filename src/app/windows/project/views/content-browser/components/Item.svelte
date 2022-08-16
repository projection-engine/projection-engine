<script>
    import FilesAPI from "../../../../../libs/files/FilesAPI"
    import handleDropFolder from "../utils/handle-drop-folder"
    import Input from "../../../../../components/input/Input.svelte";
    import FILE_TYPES from "../../../../../../assets/FILE_TYPES";
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import Preview from "../../../../../components/preview/Preview.svelte";
    import getFileIcon from "../utils/get-file-icon";
    import CBStoreController from "../../../stores/CBStoreController";
    import Localization from "../../../../../libs/Localization";
    import RendererStoreController from "../../../stores/RendererStoreController";

    const {shell} = window.require("electron")

    export let childrenQuantity
    export let reset
    export let type
    export let data
    export let selected
    export let setSelected
    export let onRename
    export let submitRename
    export let items
    export let setCurrentDirectory
    export let currentDirectory
    let currentLabel
    $: currentLabel = data.name
    $: isSelected = selected.includes(data.id)
    $: metadata = {
        path: FilesAPI.path + FilesAPI.sep + "previews" + FilesAPI.sep + data.registryID + FILE_TYPES.PREVIEW,
        type: data.type ? "." + data.type : "folder",
        childrenQuantity,
        icon: getFileIcon(data.type)
    }
    const translate = key => Localization.PROJECT.FILES[key]
    const onDbClick = () => {
        if (type === 1) {
            const fileType = "." + data.type
            if (fileType === FILE_TYPES.COMPONENT || fileType === FILE_TYPES.STYLESHEET) {
                shell.openPath(CBStoreController.ASSETS_PATH + FilesAPI.sep + data.id).catch()
                alert.pushAlert(translate("OPENING_FILE") + " (" + currentLabel + ")", "info")
            } else if (fileType === FILE_TYPES.LEVEL) {
                alert.pushAlert(translate("OPENING_LEVEL") + " (" + currentLabel + ")", "info")
                RendererStoreController.loadLevel(data)
            } else
                setSelected(data.id)
        } else {
            reset()
            setCurrentDirectory(data)
        }
    }
</script>

<div
        on:dragover={(e) => {
        if (type === 0) {
            e.preventDefault()
          //  e.currentTarget.classList.addhovered)
        }
    }}
        on:dragleave={(e) => {
        e.preventDefault()
        //e.currentTarget.classList.removehovered)
    }}
        on:drop={e => {
        e.preventDefault()
        //e.currentTarget.parentNode.classList.removehovered)
        handleDropFolder(e.dataTransfer.getData("text"), data.id, currentDirectory, setCurrentDirectory)
    }}
        onContextMenu={() => setSelected(data.id)}
        data-file={type === 0 ? undefined : data.id}
        data-folder={type !== 0 ? undefined : data.id}
        on:dblclick={onDbClick}
        id={data.id}
        on:dragstart={(event) => {
        if (event.ctrlKey) {
            const selected = selected.map(s => {
                return items.find(i => i.id === s)
            }).filter(e => e && !e.isFolder && e.type === "mesh")
            event.dataTransfer.setData("text", JSON.stringify(selected.map(s => s.registryID)))
        } else
            event.dataTransfer.setData("text", JSON.stringify([type === 1 ? data.registryID : data.id]))
    }}
        draggable="{onRename !== data.id}"
        on:click={setSelected}
        style={isSelected ? "background: var(--pj-accent-color-light);" : "" +  (CBStoreController.toCut.includes(data.id) ? "opacity: .5;" : "")}
        class="file"
        title={currentLabel}
>

    {#if metadata.type === FILE_TYPES.COMPONENT}
        <div class="icon">
            <Icon styles="font-size: 3.5rem; ">extension</Icon>
        </div>
    {:else if metadata.type === FILE_TYPES.SCENE}
        <div class="icon">
            <Icon styles="font-size: 3.5rem; ">inventory_2</Icon>
        </div>
    {:else if metadata.type === FILE_TYPES.STYLESHEET}
        <div class="icon">
            <Icon styles="font-size: 3.5rem; ">css</Icon>
        </div>
    {:else if metadata.type === FILE_TYPES.LEVEL}
        <div class="icon">
            <Icon styles="font-size: 3.5rem; ">forest</Icon>
        </div>
    {:else if metadata.type === "folder"}
        <div class="icon">
            <Icon styles="font-size: 3.5rem; color: var(--folder-color)">folder</Icon>
            <div title="Files" class="floating-icon-wrapper">
                {childrenQuantity}
            </div>
        </div>
    {:else}
        <div class="icon">
            <Preview path={metadata.path}>
                <img class="image" slot="image" alt="logo" let:src src={src}>
                <Icon slot="icon" styles="font-size: 4rem">
                    {metadata.icon}
                </Icon>

                <div class="floating-icon-wrapper">
                    <Icon>{metadata.icon}</Icon>
                </div>
            </Preview>
        </div>
    {/if}
    {#if onRename === data.id}
        <Input
                onEnter={() => submitRename(currentLabel)}
                onBlur={() => submitRename(currentLabel)}
                setSearchString={e => currentLabel = e}
                searchString={currentLabel}
        />
    {:else }
        <div data-overflow="-" class="label">
            {currentLabel}
        </div>
    {/if}
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


    .floating-icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--pj-background-tertiary);
        position: absolute;
        bottom: 4px;
        right: 4px;
        width: 1.3rem;
        height: 1.3rem;
        border-radius: 3px;
        font-size: 0.7rem !important;
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
