<script>
    import getContextMenu from "../utils/get-context-menu"
    import {v4} from "uuid";
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import handleRename from "../utils/handle-rename";
    import Item from "./Item.svelte";
    import SelectBox from "../../../../../components/select-box/SelectBox.svelte";
    import bindShortcut from "../../shortcuts/libs/bind-shortcut";
    import getShortcuts from "../utils/get-shortcuts";
    import bindContextTarget from "../../../../../components/context-menu/libs/bind-context-target";
    import {onDestroy, onMount} from "svelte";
    import getFilesToRender from "../utils/get-files-to-render";
    import InfiniteScroller from "../../../../../components/infinite-scroller/InfiniteScroller.svelte";

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

    let cardDimensions = {
        width: 115,
        height: 115
    }
    let ref
    let maxDepth = 0
    let offset = 0
    let currentItem
    let elementsPerRow = 0

    let resizeOBS
    const internalID = v4()
    const TRIGGERS = ["data-wrapper", "data-file", "data-folder"]
    const contextMenuBinding = bindContextTarget(internalID, TRIGGERS)
    const shortcutBinding = bindShortcut({
        focusTargetLabel: translate("TITLE"),
        focusTargetIcon: "folder",
        actions: shortcutOptions
    })

    $: toRender = getFilesToRender(currentDirectory, fileType, items, searchString, elementsPerRow)
    $: contextMenuOptions = getContextMenu(currentDirectory, setCurrentDirectory, navigationHistory, v => currentItem = v, translate)
    $: shortcutOptions = getShortcuts(translate, currentDirectory, v => currentDirectory = v, v => selected = v, selected)
    $: contextMenuBinding.rebind(contextMenuOptions)
    $: shortcutBinding.rebind(ref, false, shortcutOptions)

    onMount(() => {
        shortcutBinding.onMount(ref)
        elementsPerRow = Math.round(ref.offsetWidth / cardDimensions.height)
        let timeout
        resizeOBS = new ResizeObserver(() => {
            clearTimeout(timeout)
            setTimeout(() => elementsPerRow = Math.round(ref.offsetWidth / cardDimensions.height), 250)
        })
        resizeOBS.observe(ref)
    })
    onDestroy(() => {
        shortcutBinding.onDestroy(ref)
        contextMenuBinding.onDestroy()
        resizeOBS.disconnect()
    })

    const handleSelection = (e, child) => {
        let toSelect = []
        if (e) {
            if (e.ctrlKey)
                toSelect = [...selected, child.id]
            else
                toSelect = [child.id]
        }
        setSelected(toSelect)
    }

</script>

<div
        bind:this={ref}
        id={internalID}
        class="content"
        data-wrapper={internalID}
>

    <SelectBox
            nodes={items}
            selected={selected}
            setSelected={setSelected}
    />
    <InfiniteScroller
            branchSize={cardDimensions.height}
            setMaxDepth={v => maxDepth = v}
            setOffset={v => offset = v}
            data={toRender}
    />
    {#if toRender.length > 0}
        {#each toRender as _, i}
            {#if i < maxDepth && toRender[i + offset]}
                <div class="line" style={`height: ${cardDimensions.height}px`}>
                    {#each toRender[i + offset] as child, index}
                        <Item
                                cardDimensions={cardDimensions}
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
                                setSelected={e => handleSelection(e, child)}
                                onRename={currentItem}
                                submitRename={name => handleRename(child, name, currentDirectory, setCurrentDirectory, () =>currentItem = undefined )}
                        />

                    {/each}

                </div>
            {/if}
        {/each}
    {:else}
        <div class="empty">
            <Icon styles="font-size: 100px">folder</Icon>
            <div style="font-size: .8rem">
                {translate("EMPTY")}
            </div>
        </div>
    {/if}

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

    .line {
        display: flex;
        justify-content: flex-start;
        justify-items: flex-start;

        overflow: hidden;
        max-width: 100%;
        width: fit-content;
        position: relative;
    }

    .content {
        padding: 8px;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: grid;

        align-content: flex-start;
        position: relative;

    }

</style>