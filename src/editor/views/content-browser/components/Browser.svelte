<script>
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import handleRename from "../utils/handle-rename";
    import Item from "./Item.svelte";
    import SelectBox from "../../../../shared/components/select-box/SelectBox.svelte";
    import contentBrowserActions from "../../../templates/content-browser-actions";

    import {onDestroy, onMount} from "svelte";
    import getFilesToRender from "../utils/get-files-to-render";
    import InfiniteScroller from "../../../../shared/components/infinite-scroller/InfiniteScroller.svelte";
    import HotKeysController from "../../../../shared/libs/HotKeysController";
    import SelectionStore from "../../../stores/SelectionStore";
    import Localization from "../../../../shared/libs/Localization";
    import ContextMenuController from "../../../../shared/libs/ContextMenuController";

    export let fileType
    export let setFileType
    export let searchString
    export let setSearchString
    export let currentDirectory
    export let navigationHistory
    export let setCurrentDirectory
    export let internalID
    export let store

    $: items = store.items

    let onDrag = false
    let cardDimensions = {width: 115, height: 115}
    let ref
    let maxDepth = 0
    let offset = 0
    let currentItem
    let elementsPerRow = 0
    let resizeOBS
    let selected = []
    const unsubscribe = SelectionStore.getStore(() => selected = SelectionStore.contentBrowserSelected)

    const translate = key => Localization.PROJECT.FILES[key]
    const TRIGGERS = ["data-wrapper", "data-file", "data-folder"]


    $: toRender = getFilesToRender(currentDirectory, fileType, items, searchString, elementsPerRow)


    function onDragEnd() {
        onDrag = false
    }

    $: {
        if (ref) {
            const actions = contentBrowserActions(navigationHistory, currentDirectory, setCurrentDirectory, v => currentItem = v, store.materials)
            HotKeysController.unbindAction(ref)
            ContextMenuController.destroy(internalID)
            ContextMenuController.mount(
                {
                    icon: "folder",
                    label: translate("TITLE")
                },
                actions.contextMenu,
                internalID,
                TRIGGERS,
                (trigger, element) => {
                    const id = element.getAttribute("data-id")
                    if (id != null)
                        SelectionStore.contentBrowserSelected = [id]
                }
            )
            HotKeysController.bindAction(
                ref,
                actions.hotKeys,
                "folder",
                translate("TITLE")
            )
        }
    }

    let timeout
    onMount(() => {
        document.addEventListener("dragend", onDragEnd)
        elementsPerRow = Math.round(ref.offsetWidth / (cardDimensions.width + 8))

        resizeOBS = new ResizeObserver(() => {
            clearTimeout(timeout)
            setTimeout(() => {
                if (ref) elementsPerRow = Math.floor(ref.offsetWidth / (cardDimensions.height + 8))
            }, 250)
        })
        resizeOBS.observe(ref)
    })

    onDestroy(() => {
        HotKeysController.unbindAction(ref)
        ContextMenuController.destroy(internalID)


        document.removeEventListener("dragend", onDragEnd)
        unsubscribe()
        clearTimeout(timeout)

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
        SelectionStore.contentBrowserSelected = toSelect
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
            setSelected={v => SelectionStore.contentBrowserSelected = v}
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
                                setOnDrag={v => onDrag = v}
                                onDrag={onDrag}
                                cardDimensions={cardDimensions}
                                currentDirectory={currentDirectory}
                                reset={() => {
                                            SelectionStore.contentBrowserSelected = []
                                    setSearchString("")
                                    setFileType(undefined)
                                }}
                                type={child.isFolder ? 0 : 1}
                                data={child}
                                childrenQuantity={child.children}

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
        gap: 4px;

        overflow: hidden;
        max-width: 100%;
        width: fit-content;
        position: relative;
    }

    .content {
        gap: 4px;
        padding: 8px;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: grid;

        align-content: flex-start;
        position: relative;

        background: var(--pj-background-tertiary);
        border-radius: 3px;

    }

</style>