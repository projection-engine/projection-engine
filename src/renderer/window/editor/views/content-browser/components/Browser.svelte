<script>
    import Item from "./item/Item.svelte"
    import SelectBox from "../../../../shared/components/select-box/SelectBox.svelte"
    import VirtualList from "@sveltejs/svelte-virtual-list"
    import {onDestroy, onMount} from "svelte"
    import HotKeysController from "../../../../shared/lib/HotKeysController"
    import EntitySelectionStore from "../../../../shared/stores/EntitySelectionStore"

    import ITEM_TYPES from "../static/ITEM_TYPES"
    import BrowserHeader from "./BrowserHeader.svelte"
    import Icon from "../../../../shared/components/icon/Icon.svelte"
    import ContextMenuService from "../../../../shared/lib/context-menu/ContextMenuService"
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"
    import ContentBrowserUtil from "../../../util/ContentBrowserUtil"
    import ContentBrowserStore from "../../../../shared/stores/ContentBrowserStore"

    const COMPONENT_ID = crypto.randomUUID()
    const CARD_SIZE = 115
    export let fileType
    export let setFileType
    export let inputValue
    export let onChange
    export let currentDirectory
    export let navigationHistory
    export let setCurrentDirectory
    export let viewType
    export let sortKey
    export let sortDirection

    let ref
    let currentItem
    let elementsPerRow = 0
    let resizeOBS
    let onDrag = false
    let timeout
    let store = {}
    let isRowType = false
    let lineHeight
    let toRender

    function resetItem() {
    	ContentBrowserStore.setContentBrowserSelected([])
    	onChange("")
    	setFileType(undefined)
    }

    $:{
    	isRowType = viewType === ITEM_TYPES.ROW
    	lineHeight = isRowType ? 23 : CARD_SIZE
    }
    $: toRender = ContentBrowserUtil.getFilesToRender(currentDirectory, fileType, store.items, inputValue, elementsPerRow, sortKey, sortDirection)

    $: {
    	if (!isRowType && ref)
    		elementsPerRow = Math.floor(ref.offsetWidth / (CARD_SIZE + 8))
    	else if (isRowType)
    		elementsPerRow = 1
    }

    onMount(() => {
    	ContentBrowserUtil.buildContextMenuAndHotKeys(COMPONENT_ID, ref, navigationHistory, () => currentDirectory, setCurrentDirectory, v => currentItem = v)
    	ContentBrowserStore.getInstance().addListener(COMPONENT_ID, v => store = v)
    	resizeOBS = new ResizeObserver(() => {
    		if (isRowType)
    			return
    		clearTimeout(timeout)
    		setTimeout(() => {
    			if (ref) elementsPerRow = Math.floor(ref.offsetWidth / (CARD_SIZE + 8))
    		}, 250)
    	})
    	resizeOBS.observe(ref)

    })

    onDestroy(() => {

    	ContentBrowserStore.getInstance().removeListener(COMPONENT_ID)
    	EntitySelectionStore.getInstance().removeListener(COMPONENT_ID)
    	HotKeysController.unbindAction(ref)
    	ContextMenuService.getInstance().destroy(COMPONENT_ID)
    	clearTimeout(timeout)
    	resizeOBS?.disconnect?.()
    })

</script>

<div
        bind:this={ref}
        id={COMPONENT_ID}
        on:mousedown={e => {
            const key = "data-svelteisitem"
            if(e.composedPath().find(element => element.getAttribute?.(key) != null) == null)
                ContentBrowserStore.setContentBrowserSelected([])
        }}
        style={isRowType && toRender.length > 0? "padding: 0;": undefined}
        class="content"
>
    <SelectBox
            nodes={toRender.flat()}
            getSelected={ContentBrowserStore.getContentBrowserSelected}
            setSelected={ContentBrowserStore.setContentBrowserSelected}
    />
    {#if toRender.length > 0}
        {#if isRowType}
            <BrowserHeader/>
        {/if}
        <VirtualList items={toRender} let:item>
            <div class="line"
                 style={ "height:" + lineHeight + "px;" + (viewType === ITEM_TYPES.CARD ? "margin-bottom: 3px;" : "")}>
                {#each item as child, index}
                    <Item
                            setOnDrag={v => onDrag = v}
                            onDrag={onDrag}
                            selectedItems={store.selectedItems}
                            toCut={store.toCut}
                            reset={resetItem}
                            data={child}
                            setCurrentDirectory={setCurrentDirectory}
                            isOnRename={currentItem === child.id}
                            isCardViewType={viewType === ITEM_TYPES.CARD}
                            submitRename={async name => {
                                await ContentBrowserUtil.handleRename(child, name, currentDirectory, setCurrentDirectory)
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
                {LocalizationEN.EMPTY}
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
