<script>
    import getContextMenu from "../utils/get-context-menu"
    import FileSystem from "../../../../../libs/FileSystem"
    import {v4} from "uuid";
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import handleRename from "../utils/handle-rename";
    import Item from "./Item.svelte";
    import SelectBox from "../../../../../components/select-box/SelectBox.svelte";
    import bindShortcut from "../../shortcuts/libs/bind-shortcut";
    import getShortcuts from "../utils/get-shortcuts";
    import bindContextTarget from "../../../../../components/context-menu/libs/bind-context-target";
    import {onDestroy, onMount} from "svelte";

    export let fileType
    export let setFileType
    export let searchString
    export let setSearchString
    export let selected
    export let setSelected
    export let translate
    export let items
    export let currentDirectory
    export let navigationHistory
    export let setCurrentDirectory
    let ref

    function map(arr, items) {
        return arr.map(e => {
            return {
                ...e,
                children: e.isFolder ? items.filter(i => {
                    return typeof i.parent === "string" && i.parent === e.id
                }).length : 0,
            }
        })
    }

    const internalID = v4()
    const TRIGGERS = [
        "data-wrapper",
        "data-file",
        "data-folder"
    ]

    let currentItem
    $: filesToRender = (() => {
        let type = fileType?.split("")
        if (type) {
            type.shift()
            type = type.join("")
        }
        if (searchString || fileType)
            return map(items.filter(file => (searchString.trim() && file.name.toLowerCase().includes(searchString) || type && file.type === type && !file.isFolder), items))
        if (currentDirectory.id !== FileSystem.sep)
            return map(
                items.filter(file => file.parent === currentDirectory.id),
                items
            )
        return map(items.filter(file => !file.parent), items)
    })();
    $: contextMenuOptions = getContextMenu(currentDirectory, setCurrentDirectory, navigationHistory, v => currentItem = v, translate)
    $: shortcutOptions = getShortcuts(translate, currentDirectory, v => currentDirectory = v, v => selected = v, selected)
    const shortcutBinding = bindShortcut({
        focusTargetLabel: translate("TITLE"),
        focusTargetIcon: "folder",
        actions: shortcutOptions
    })
    const contextMenuBinding = bindContextTarget(internalID, TRIGGERS)
    $: contextMenuBinding.rebind(contextMenuOptions)
    $: shortcutBinding.rebind(ref, false, shortcutOptions)
    onMount(() => shortcutBinding.onMount(ref))
    onDestroy(() => {
        shortcutBinding.onDestroy(ref)
        contextMenuBinding.onDestroy()
    })


</script>

<div
        bind:this={ref}
        id={internalID}
        class="content"
        data-wrapper={internalID}
>
    <div class="filesWrapper">
        <SelectBox
                nodes={items}
                selected={selected}
                setSelected={setSelected}
        />
        {#if filesToRender.length > 0}
            {#each filesToRender as child, index}
                <Item
                        currentDirectory={currentDirectory}
                        reset={() => {
                            setSelected([])
                            setSearchString("")
                            setFileType(undefined)
                        }}
                        type={child.isFolder ? 0 : 1}
                        data={child}
                        childrenQuantity={child.children}
                        selected={selected}
                        setCurrentDirectory={setCurrentDirectory}
                        items={items}
                        setSelected={(e) => {
                        let toSelect = []
                            if (e) {
                                if (e.ctrlKey)
                                    toSelect= [...selected, child.id]
                                    else
                                toSelect = [child.id]
                            }


                            setSelected(toSelect)
                        }}
                        onRename={currentItem}
                        submitRename={name => handleRename(child, name, currentDirectory, setCurrentDirectory, () =>currentItem = undefined )}
                />
            {/each}
            <div></div>
        {:else}
            <div class="empty">
                <Icon styles="font-size: 100px">folder</Icon>
                <div style="font-size: .8rem">
                    {translate("EMPTY")}
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .empty {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: grid;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
        width: 100%;
        height: 100%;
        font-weight: bold;
        color: var(--pj-color-quaternary);
    }

    .filesWrapper {
        overflow-y: auto;
        overflow-x: hidden;
        max-height: 100%;
        height: 100%;
        padding: 8px;
        gap: 8px;
        border-radius: 5px;

        min-height: 100%;
        position: relative;
        display: grid;
        align-content: flex-start;
        --card-size: 115px;
        grid-template-columns: repeat(auto-fill, minmax(var(--card-size), 1fr));

    }

    .content {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        display: flex;
        flex-flow: column;
        grid-auto-flow: row dense;
    }

</style>