<script>
    import handleRename from "../utils/handle-rename";
    import Item from "./item/Item.svelte";
    import SelectBox from "../../../../../components/select-box/SelectBox.svelte";
    import contentBrowserActions from "../../../templates/content-browser-actions";
    import VirtualList from '@sveltejs/svelte-virtual-list';
    import {onDestroy, onMount} from "svelte";
    import getFilesToRender from "../utils/get-files-to-render";
    import HotKeysController from "../../../lib/utils/HotKeysController";
    import SelectionStore from "../../../stores/SelectionStore";
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import SettingsStore from "../../../stores/SettingsStore";
    import ITEM_TYPES from "../templates/ITEM_TYPES";
    import RowsHeader from "./RowsHeader.svelte";
    import Icon from "../../../../../components/icon/Icon.svelte";
    import ContextMenuController from "../../../../../lib/context-menu/ContextMenuController";

    const CARD_SIZE = 115
    export let fileType
    export let setFileType
    export let inputValue
    export let onChange
    export let currentDirectory
    export let navigationHistory
    export let setCurrentDirectory
    export let internalID
    export let store

    export let viewType

    let onDrag = false
    let ref
    let currentItem
    let elementsPerRow = 0
    let resizeOBS
    let settings
    let selectionMap
    let selected = []
    let timeout
    let toRender = []

    const TRIGGERS = ["data-sveltewrapper", "data-sveltefile", "data-sveltefolder"]

    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    const unsubscribe = SelectionStore.getStore(() => {
        selected = SelectionStore.contentBrowserSelected
        selectionMap = SelectionStore.map
    })
    const onDragEnd = () => onDrag = false
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

    function resetItem() {
        SelectionStore.contentBrowserSelected = []
        onChange("")
        setFileType(undefined)
    }

    $: lineHeight = viewType === ITEM_TYPES.ROW ? 23 : CARD_SIZE
    $: items = store.items
    $: toRender = getFilesToRender(currentDirectory, fileType, items, inputValue, elementsPerRow)

    $: {
        if (ref) {
            const actions = contentBrowserActions(settings, navigationHistory, currentDirectory, setCurrentDirectory, v => currentItem = v, store.materials)
            HotKeysController.unbindAction(ref)
            ContextMenuController.destroy(internalID)
            ContextMenuController.mount(
                actions.contextMenu,
                internalID,
                TRIGGERS,
                (trigger, element) => {
                    const id = element.getAttribute("data-svelteid")
                    if (id != null)
                        SelectionStore.contentBrowserSelected = [id]
                }
            )
            HotKeysController.bindAction(
                ref,
                actions.hotKeys,
                "folder",
                LOCALIZATION_EN.CONTENT_BROWSER
            )
        }
    }
    $: {
        if (viewType === ITEM_TYPES.CARD && ref)
            elementsPerRow = Math.floor(ref.offsetWidth / (CARD_SIZE + 8))
        else if (viewType !== ITEM_TYPES.CARD)
            elementsPerRow = 1
    }

    onMount(() => {
        document.addEventListener("dragend", onDragEnd)
        resizeOBS = new ResizeObserver(() => {
            if (viewType !== ITEM_TYPES.CARD)
                return
            clearTimeout(timeout)
            setTimeout(() => {
                if (ref) elementsPerRow = Math.floor(ref.offsetWidth / (CARD_SIZE + 8))
            }, 250)
        })
        resizeOBS.observe(ref)
    })

    onDestroy(() => {
        unsubscribeSettings()
        HotKeysController.unbindAction(ref)
        ContextMenuController.destroy(internalID)
        document.removeEventListener("dragend", onDragEnd)
        unsubscribe()
        clearTimeout(timeout)
        if(resizeOBS)
            resizeOBS.disconnect()
    })
</script>

<div
        bind:this={ref}
        id={internalID}
        data-sveltewrapper={internalID}
        on:mousedown={e => {
            const key = "data-svelteisitem"
            if(e.composedPath().find(element => element.getAttribute?.(key) != null) == null)
                SelectionStore.contentBrowserSelected = []
        }}
        style={viewType === ITEM_TYPES.ROW  && toRender.length > 0? "padding: 0;": undefined}
        class="content"
>
    <SelectBox
            allowAll={true}
            nodes={toRender.flat()}
            selected={selected}
            setSelected={v => SelectionStore.contentBrowserSelected = v}
    />
    {#if toRender.length > 0}
        {#if viewType === ITEM_TYPES.ROW}
            <RowsHeader items={toRender} updateItems={v => toRender = v}/>
        {/if}
        <VirtualList items={toRender} let:item>
            <div class="line"
                 style={ "height:" + lineHeight + "px;" + (viewType === ITEM_TYPES.CARD ? "margin-bottom: 3px;" : "")}>
                {#each item as child, index}
                    <Item
                            viewType={viewType}
                            selectionMap={selectionMap}
                            setOnDrag={v => onDrag = v}
                            onDrag={onDrag}
                            toCut={store.toCut}
                            currentDirectory={currentDirectory}
                            reset={resetItem}
                            type={child.isFolder ? 0 : 1}
                            data={child}
                            childQuantity={child.children}
                            setCurrentDirectory={setCurrentDirectory}
                            items={items}
                            setSelected={e => handleSelection(e, child)}
                            onRename={currentItem}
                            submitRename={async name => {
                                await handleRename(child, name, currentDirectory, setCurrentDirectory )
                                currentItem = undefined
                            }}
                    />
                {/each}
            </div>
        </VirtualList>
    {:else}
        <div data-svelteempty="-">
            <Icon styles="font-size: 100px">folder</Icon>
            <div style="font-size: .8rem">
                {LOCALIZATION_EN.EMPTY}
            </div>
        </div>
    {/if}

</div>

<style>

    .line {
        display: flex;
        gap: 3px;
        align-items: center;
        height: 100%;
        width: 100%;
    }

    .content {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        position: relative;
        border-radius: 3px;
    }
</style>