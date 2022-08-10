<script>
    export let tab
    export let setTab
    export let translate
</script>

<div class="wrapper">
    <button class="button" data-highlight={tab === 0 ? "-" : undefined} on:click={() => setTab(0)}>
        {translate("RENDERING")}
    </button>
    <button class="button" data-highlight={tab === 1? "-" : undefined} on:click={() => setTab(1)}>
        {translate("POST_PROCESSING")}
    </button>
    <button class="button" data-highlight={tab === 2? "-" : undefined} on:click={() => setTab(2)}>
        {translate("VIEWPORT")}
    </button>
</div>

<style>
    .wrapper {
        padding: 4px;
        min-width: clamp(250px, 15vw, 350px);
        display: grid;
        align-content: flex-start;
        gap: 4px;
        background: var(--pj-background-secondary);
        border-right: var(--pj-border-primary) 1px solid;
    }

    .button {
        width: 100%;
        height: 35px;
        text-align: left;
    }
</style>