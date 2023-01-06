<script>
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import {onMount} from "svelte";
    import Icon from "../../../../components/icon/Icon.svelte";

    export let items
    export let updateItems

    const SORTS = ["ASC", "DSC"]
    const SORTS_KEYS = ["name", "creationDate", "size"]

    let sortKey = SORTS_KEYS[0]
    let sort = SORTS[0]

    function sortData(arr, isDSC) {
        function compare(A, B) {
            const a = A[0], b = B[0]
            if (a[sortKey] < b[sortKey])
                return isDSC ? -1 : 1;
            if (a[sortKey] > b[sortKey])
                return isDSC ? 1 : -1;
            return 0;
        }

        return arr.sort(compare);
    }

    onMount(() => {
        updateItems(sortData(items, sort === SORTS[1]))
    })
    function changeSort() {
        if (sort === SORTS[0])
            sort = SORTS[1]
        else
            sort = SORTS[0]
        updateItems(sortData(items, sort === SORTS[1]))
    }

</script>
<div class="wrapper">
    <small
            class="section"
            style="border-right: var(--pj-border-primary) 1px solid"
            on:click={() => {
                sortKey= SORTS_KEYS[0]
                changeSort()
            }}
    >
        {LOCALIZATION_EN.NAME}
        {#if sortKey === SORTS_KEYS[0]}
            <Icon styles={sort === SORTS[0] ? "transform: rotate(180deg)" : undefined}>
                    arrow_drop_down
            </Icon>
        {/if}
    </small>
    <small
            class="section"
            style="border-right: var(--pj-border-primary) 1px solid"
            on:click={() => {
                sortKey= SORTS_KEYS[1]
                changeSort()
            }}
    >
        {LOCALIZATION_EN.CREATION}
        {#if sortKey === SORTS_KEYS[1]}
            <Icon styles={sort === SORTS[0] ? "transform: rotate(180deg)" : undefined}>
                arrow_drop_down
            </Icon>
        {/if}
    </small>
    <small
            class="section"
            on:click={() => {
                sortKey= SORTS_KEYS[2]
                changeSort()
            }}
    >
        {LOCALIZATION_EN.SIZE}
        {#if sortKey === SORTS_KEYS[2]}
            <Icon styles={sort === SORTS[0] ? "transform: rotate(180deg)" : undefined}>
                arrow_drop_down
            </Icon>
        {/if}
    </small>
</div>

<style>
    small{
        font-size: .7rem;
    }
    .section {
        padding-left: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .section:hover{
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