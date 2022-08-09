<script>
    export let type = ""
    export let title
    let open = false
</script>


<div class="accordion" style={open ? undefined : "overflow: hidden; height: 25px;"}>
    <div class="summary">
        <span
                data-icon="-"
                style={`transform: ${open ? "none" : "rotate(-90deg)"}; cursor: pointer;font-size: 1.25rem`}
                on:click={() => open = !open}
                data-accordion={"true"}
        >
            expand_more
        </span>
        {#if title}
            {title}
        {:else}
            <slot name="header"/>
        {/if}
    </div>
    <div class="content" style={`display: ${open ? (type ? type : "grid") : "none"}`}>
        <slot/>
    </div>
</div>

<style>
    .accordion {
        display: grid;
        border: var(--pj-border-primary) 1px solid;
        max-width: 100%;
        background-color: var(--pj-background-primary);
        user-select: none;
        border-radius: 3px;
    }


    .content {
        gap: 4px;
        padding: 4px;
        max-width: 100%;
        overflow: hidden;
        background: var(--pj-background-tertiary);
    }

    .summary {
        height: 25px;
        background-color: var(--pj-background-primary) !important;
        border: none;
        border-radius: 3px;
        font-size: 0.7rem !important;
        font-weight: 550;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        position: relative;
        user-select: none;

        color: var(--pj-color-secondary);
        width: 100%;
        max-width: 100%;
        padding: 0 4px;

        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

</style>