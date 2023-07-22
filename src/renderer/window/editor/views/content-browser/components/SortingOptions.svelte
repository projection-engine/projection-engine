<script>

    import Icon from "../../../../shared/components/icon/Icon.svelte"
    import {SORTS, SORTS_KEYS} from "../static/SORT_INFO"
    import Dropdown from "../../../../shared/components/dropdown/Dropdown.svelte"
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte"
    import getDropdownHeaderStyles from "../../../../shared/components/dropdown/utils/get-dropdown-header-styles"
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"
    import EmptyIcon from "../../../../shared/components/icon/EmptyIcon.svelte"

    export let setSortKey
    export let setSortDirection
    export let sortDirection
    export let sortKey

    function changeSort() {
    	if (sortDirection === SORTS[0])
    		setSortDirection(SORTS[1])
    	else
    		setSortDirection(SORTS[0])
    }

</script>

<Dropdown buttonStyles={getDropdownHeaderStyles()}>
    <button data-sveltebuttondefault="-" slot="button" data-svelteview-header-dropdown="-">
        <ToolTip content={LocalizationEN.FILTER_TYPE}/>
        <Icon styles="font-size: .9rem">sort</Icon>
    </button>

    <button data-sveltebuttondefault="-" on:click={() => setSortKey( SORTS_KEYS[0])}>
        {#if sortKey === SORTS_KEYS[0]}
            <Icon>check</Icon>
        {:else}
            <EmptyIcon/>
        {/if}
        {LocalizationEN.NAME}
    </button>
    <button data-sveltebuttondefault="-" on:click={() => setSortKey( SORTS_KEYS[1])}>
        {#if sortKey === SORTS_KEYS[1]}
            <Icon>check</Icon>
        {:else}
            <EmptyIcon/>
        {/if}
        {LocalizationEN.CREATION}
    </button>
    <button data-sveltebuttondefault="-" on:click={() => setSortKey( SORTS_KEYS[2])}>
        {#if sortKey === SORTS_KEYS[2]}
            <Icon>check</Icon>
        {:else}
            <EmptyIcon/>
        {/if}
        {LocalizationEN.SIZE}
    </button>
</Dropdown>
<button data-sveltebuttondefault="-"
        data-svelteview-header-button="-"
        on:click={changeSort}
>
    <Icon styles={sortDirection === SORTS[1] ? undefined : "transform: rotate(180deg)"}>arrow_downward</Icon>
    <ToolTip content={sortDirection === SORTS[1]  ? LocalizationEN.DESCENDING : LocalizationEN.ASCENDING}/>
</button>

<style>
    small {
        font-size: .7rem;
    }

    .section {
        padding-left: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .section:hover {
        color: var(--pj-accent-color);
    }

    .wrapper {
        height: 23px;
        background: var(--pj-background-secondary);

        display: grid;
        align-items: center;
        grid-auto-flow: column;
        grid-template-columns: 80% 10% 10%;

    }
</style>