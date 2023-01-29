<script>
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import {onMount} from "svelte";
    import Icon from "../../../../../components/icon/Icon.svelte";
    import sortItems from "../utils/sort-items";
    import {SORTS, SORTS_KEYS} from "../static/SORT_INFO";

    export let sort

</script>

<div class="wrapper">
    <small class="section" style="border-right: var(--pj-border-primary) 1px solid">
        {LOCALIZATION_EN.NAME}
    </small>
    <small class="section" style="border-right: var(--pj-border-primary) 1px solid">
        {LOCALIZATION_EN.CREATION}

    </small>
    <small class="section">
        {LOCALIZATION_EN.SIZE}

    </small>
</div>

<style>
    small{
        font-size: .7rem;
    }
    .section {
        padding-left: 8px;
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