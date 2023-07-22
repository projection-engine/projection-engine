<script>

    import {onMount} from "svelte"
    import Icon from "../../shared/components/icon/Icon.svelte"
    import Input from "../../shared/components/input/Input.svelte"

    import ToolTip from "../../shared/components/tooltip/ToolTip.svelte"
    import LocalizationEN from "../../../../shared/enums/LocalizationEN"

    export let items
    export let getLabel
    export let getID
    export let favoriteKey

    let favoriteFilter = false
    let favorites = {}
    let filter = ""
    let initialized = false
    $:{
    	if (initialized)
    		localStorage.setItem(favoriteKey + "CACHE", favoriteFilter ? "0" : "1")
    }
    onMount(() => {
    	favoriteFilter = localStorage.getItem(favoriteKey + "CACHE") === "0"
    	initialized = true
    	const f = localStorage.getItem(favoriteKey)
    	if (f)
    		favorites = JSON.parse(f)
    })
    const SORTS = {
    	ASC: 1,
    	DSC: 2
    }
    let itemsToRender
    let sort = SORTS.ASC

    function switchSorts() {
    	switch (sort) {
    	case SORTS.ASC:
    		sort = SORTS.DSC
    		break
    	case SORTS.DSC:
    		sort = SORTS.ASC
    		break
    	}
    }

    function sortData(arr, isDSC) {
    	function compare(a, b) {
    		if (getLabel(a) < getLabel(b))
    			return isDSC ? -1 : 1
    		if (getLabel(a) > getLabel(b))
    			return isDSC ? 1 : -1
    		return 0
    	}

    	return arr.sort(compare)
    }

    $: {
    	const toRender = favoriteFilter || filter ? items.filter(e => {
    		return favoriteFilter && favorites[getID(e)] || !favoriteFilter && getLabel(e).includes(filter)
    	}) : items
    	switch (sort) {

    	case SORTS.ASC:
    		itemsToRender = sortData(toRender, false)
    		break
    	case SORTS.DSC:
    		itemsToRender = sortData(toRender, true)
    		break
    	}
    }
</script>


<div class="header">
    <button data-sveltebuttondefault="-"
            on:click={() => favoriteFilter = !favoriteFilter}
            data-sveltehighlight={favoriteFilter ? "-" : undefined}
    >
        <Icon>star</Icon>
    </button>
    <div data-sveltevertdivider="-"></div>
    <button data-sveltebuttondefault="-" on:click={switchSorts}>
        {#if sort === SORTS.ASC}
            <Icon>arrow_downward</Icon>
        {:else}
            <Icon>arrow_upward</Icon>
        {/if}

    </button>
    <div style="margin-left: auto">

        <Input
                hasBorder="true"
                placeholder={LocalizationEN.SEARCH}
                onEnter={v => filter = v}
                onChange={v => filter = v}
                height="30px"
                onBlur={(_, v) => filter = v}
                inputValue={filter}>
            <Icon slot="icon" styles="font-size: 1rem">
                search
            </Icon>
        </Input>
    </div>
</div>
<div class="content">
    {#if itemsToRender.length > 0}
        {#each itemsToRender as item}
            <div class="item">
                <button data-sveltebuttondefault="-"
                        data-sveltehighlight={favorites[getID(item)] ? "-" : undefined}
                        class="favorite-button"
                        on:click={() => {
                    const ID = getID(item)
                    if(!favorites[ID])
                        favorites = {...favorites, [ID]: true}
                    else
                        favorites = {...favorites, [ID]: undefined}

                    localStorage.setItem(favoriteKey, JSON.stringify(favorites))
                }}
                >
                    <Icon>star</Icon>
                    <ToolTip content={LocalizationEN.FAVORITE}/>
                </button>
                <slot item={item}/>
            </div>
        {/each}
    {:else}

        <div data-svelteempty="-">
            <Icon styles="font-size: 100px; color: #999;">folder</Icon>
            {LocalizationEN.EMPTY}
        </div>

    {/if}
</div>
<style>
    .content {
        position: relative;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 2px;

        align-items: flex-start;
        overflow-x: hidden;
        overflow-y: auto;

    }

    .favorite-button {
        height: 100%;
        background: var(--pj-background-secondary);
        width: 30px;
    }

    .item {

        display: flex;
        align-items: center;
        gap: 3px;
        width: 100%;

    }

    button {
        width: 30px;
        height: 30px;
        background: var(--pj-background-primary);
        border: none;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .header {
        height: 40px;
        width: 100%;
        display: flex;
        align-items: center;
        border-bottom: var(--pj-border-primary) 1px solid;
        margin-bottom: 8px;
        padding-bottom: 4px;

    }
</style>