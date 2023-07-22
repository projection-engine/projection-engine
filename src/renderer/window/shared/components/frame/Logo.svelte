<script>

    import About from "./About.svelte"
    import LocalizationEN from "../../../../../shared/enums/LocalizationEN"

    let aboutModalIsOpen = false
</script>

<button data-svelteinline="-" on:click={() => aboutModalIsOpen =true}>
    <img src="APP_LOGO.png" alt="logo">
    <small>{LocalizationEN.PROJECTION_ENGINE}</small>
</button>
{#if aboutModalIsOpen}
    <About handleClose={() => aboutModalIsOpen = false}/>
{/if}
<style>
    button {
        background: none;
        border: none;
        padding: 0 4px;
        gap: 4px;
        cursor: pointer;
    }

    img {
        height: 22px;
        overflow: hidden;
    }

    small {
        color: var(--pj-color-primary);
        white-space: nowrap;
        font-size: .7rem;
    }
</style>