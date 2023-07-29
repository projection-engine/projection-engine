<script>
    import Icon from "./icon/Icon.svelte"

    export let title
    export let allowDeletion
    export let onDelete
</script>
<div data-svelteinline="-" class="title-wrapper">
    <h4 data-svelteoverflow="-">{title}</h4>
    {#if allowDeletion}
        <button data-sveltebuttondefault="-"  class="button" on:click={onDelete}>
            <Icon>delete_forever</Icon>
        </button>
    {/if}
</div>

<style>
    h4{
        margin: 0;
        font-size: initial !important;
    }

    .title-wrapper {
        border-bottom: var(--pj-border-primary) 1px solid;
        justify-content: space-between;
        width: 100%;
        min-height: 30px;
        max-height: 30px;
        padding: 4px 8px;
    }

    .button {
        border: none;
        margin-left: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 25px;
        height: 25px;
    }
</style>
