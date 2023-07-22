<script>

    import Icon from "../icon/Icon.svelte"

    export let checked
    export let handleCheck
    export let label
    export let disabled
</script>

<div
        class="wrapper"
        data-sveltedisabled={disabled ? "-" : undefined}
        data-svelteoverflow="-"
>
    <button
            data-sveltebuttondefault="-"
            class="check-button"
            class:check-button-checked={checked}
            disabled={disabled}
            on:click={() => handleCheck(checked)}
    >
        {#if checked}
            <Icon styles="font-size: .8rem; color: white">check</Icon>
        {/if}
    </button>
    {label}
</div>

<style>
    .check-button-checked {
        background: var(--pj-accent-color) !important;
    }

    .check-button {
        outline: none;

        border: var(--pj-border-primary) 1px solid;

        max-width: 13px;
        max-height: 13px;
        min-width: 13px;
        min-height: 13px;

        border-radius: 50%;
        background: transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

    }

    .check-button:hover {
        border: var(--pj-accent-color) 1px solid;
    }

    .check-button:active {
        background: var(--pj-background-quaternary);
        border: var(--pj-accent-color) 1px solid;
    }

    .check-button:disabled {
        background: transparent;
        border-color: var(--pj-color-quaternary);
        cursor: unset;
    }

    .wrapper {
        height: 23px;
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: .7rem;
        width: 100%;
        color: var(--pj-color-tertiary);
    }
</style>