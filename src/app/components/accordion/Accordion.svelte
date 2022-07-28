<script>
    export let type = ""
</script>


<details class="accordion">
    <summary class="summary">
        <span data-icon="-" data-accordion={"true"} style="font-size: 1.25rem">expand_more</span>
        <slot name="header"/>
    </summary>
    <div class="content" style={`display: ${type ? type : "grid"}`}>
        <slot/>
    </div>
</details>

<style>
    .accordion {
        display: grid;
        border: var(--pj-border-primary) 1px solid !important;
        max-width: 100%;
        overflow: hidden;
        background-color: var(--pj-background-primary);
        user-select: none;
        max-height: unset !important;
        min-height: unset !important;
        border-radius: 3px;
    }

    .accordion:not([open]) > summary > span[data-accordion="true"] {
        transform: rotate(-90deg);
    }

    .content {
        gap: 4px;
        padding: 4px;
        max-width: 100%;
        overflow: hidden;
        background: var(--pj-background-secondary);
    }

    .summary {
        height: 25px;
        background-color: var(--pj-border-primary) !important;
        border-radius: 0 !important;
        font-size: 0.7rem !important;
        font-weight: 550;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        position: relative;
        user-select: none;
        cursor: pointer;

        color: var(--pj-color-secondary);
        width: 100%;
        max-width: 100%;
        padding: 2px 6px !important;

        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

</style>