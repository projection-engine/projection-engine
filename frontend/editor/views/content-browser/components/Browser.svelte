<!--suppress ALL -->
<script>
    import Item from "./item/Item.svelte"
    import SelectBox from "../../../../shared/components/select-box/SelectBox.svelte"
    import getContentBrowserActions from "../../../templates/get-content-browser-actions"
    import VirtualList from "@sveltejs/svelte-virtual-list"
    import {onDestroy, onMount} from "svelte"
    import HotKeysController from "../../../../shared/lib/HotKeysController"
    import SelectionStore from "../../../../stores/SelectionStore"

    import ITEM_TYPES from "../static/ITEM_TYPES"
    import RowsHeader from "./BrowserHeader.svelte"
    import Icon from "../../../../shared/components/icon/Icon.svelte"
    import ContextMenuService from "../../../../shared/lib/context-menu/ContextMenuService"
    import LocalizationEN from "../../../../../shared/LocalizationEN"
    import ContentBrowserUtil from "../../../util/ContentBrowserUtil"
    import SelectionStoreUtil from "../../../util/SelectionStoreUtil"

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
    export let settings
    export let sortKey
    export let sortDirection

    let ref
    let currentItem
    let elementsPerRow = 0
    let resizeOBS
    let selectionList
    let selected = []
    let onDrag = false
    let timeout


    const unsubscribe = SelectionStore.getStore(() => {
    	selected = SelectionStoreUtil.getContentBrowserSelected()
    	selectionList = SelectionStoreUtil.getSelectionList()
    })

    function resetItem() {
    	SelectionStoreUtil.setContentBrowserSelected([])
    	onChange("")
    	setFileType(undefined)
    }

    $: lineHeight = viewType === ITEM_TYPES.ROW ? 23 : CARD_SIZE
    $: toRender = ContentBrowserUtil.getFilesToRender(currentDirectory, fileType, store.items, inputValue, elementsPerRow, sortKey, sortDirection)

    $: {
    	if (ref) {
    		const actions = getContentBrowserActions(settings, navigationHistory, currentDirectory, setCurrentDirectory, v => currentItem = v, store.materials)
    		HotKeysController.unbindAction(ref)
    		ContextMenuService.getInstance().destroy(internalID)
    		ContextMenuService.getInstance().mount(
    			actions.contextMenu,
    			internalID,
    			(trigger, element) => {
    				const id = element.getAttribute("data-svelteid")
    				if (id != null)
    					SelectionStoreUtil.setContentBrowserSelected([id])
    			}
    		)
    		HotKeysController.bindAction(
    			ref,
    			actions.hotKeys,
    			"folder",
    			LocalizationEN.CONTENT_BROWSER
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
    	HotKeysController.unbindAction(ref)
    	ContextMenuService.getInstance().destroy(internalID)
    	unsubscribe()
    	clearTimeout(timeout)
    	resizeOBS?.disconnect?.()
    })
</script>

<div
        bind:this={ref}
        id={internalID}
        data-sveltewrapper={internalID}
        on:mousedown={e => {
            const key = "data-svelteisitem"
            if(e.composedPath().find(element => element.getAttribute?.(key) != null) == null)
                SelectionStoreUtil.setContentBrowserSelected([])
        }}
        style={viewType === ITEM_TYPES.ROW  && toRender.length > 0? "padding: 0;": undefined}
        class="content"
>
    <SelectBox
            allowAll={true}
            nodes={toRender.flat()}
            selected={selected}
            setSelected={v => SelectionStoreUtil.setContentBrowserSelected(v)}
    />
    {#if toRender.length > 0}
        {#if viewType === ITEM_TYPES.ROW}
            <RowsHeader sort={sortKey}/>
        {/if}
        <VirtualList items={toRender} let:item>
            <div class="line"
                 style={ "height:" + lineHeight + "px;" + (viewType === ITEM_TYPES.CARD ? "margin-bottom: 3px;" : "")}>
                {#each item as child, index}
                    <Item
                            selectionList={selectionList}
                            setOnDrag={v => onDrag = v}
                            onDrag={onDrag}
                            toCut={store.toCut}
                            currentDirectory={currentDirectory}
                            reset={resetItem}
                            type={child.isFolder ? 0 : 1}
                            data={child}
                            childQuantity={child.children}
                            setCurrentDirectory={setCurrentDirectory}
                            items={store.items}
                            setSelected={e => ContentBrowserUtil.handleSelection(e, child)}
                            isOnRename={currentItem === child.id}
                            isCardViewType={viewType === ITEM_TYPES.CARD}
                            submitRename={async name => {
                                await ContentBrowserUtil.handleRename(child, name, currentDirectory, setCurrentDirectory )
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