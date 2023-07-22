<script>
    import ToolTip from "../tooltip/ToolTip.svelte"
    import Icon from "../icon/Icon.svelte"

    export let title
    export let background
    export let startOpen
    export let styles

    let open = startOpen === true
</script>


<div class="accordion" class:closed={!open} style={background ? `background: ${background};` : undefined}>
    <div class="summary">
        <button data-sveltebuttondefault="-"  class="dropdown-button" on:click={() => open = !open}>
            <Icon styles={`transform: ${open ? "none" : "rotate(-90deg)"}; font-size: 1rem`}>
                expand_more
            </Icon>
        </button>
        {#if title}
            {title}
            <ToolTip content={title}/>
        {:else}
            <div data-svelteoverflow="-" class="summary-wrapper">
                <slot name="header"/>
            </div>
        {/if}
    </div>
    {#if open}
        <div class="content" style={styles}>
            <slot/>
        </div>
    {/if}
</div>

<style>
    .accordion {
        display: grid;
        background-color: var(--pj-background-secondary);
        max-width: 100%;
        user-select: none;
        border-radius: 3px;
        box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.2);
    }
    .summary-wrapper{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: var(--pj-color-tertiary);
    }
    .dropdown-button {
        border: none;
        background: none;

        display: flex;
        align-items: center;
        justify-content: center;

        padding: 0;

        width: 17px;
        height: 17px;
        overflow: hidden;
    }

    .dropdown-button:hover {
        opacity: .9;
    }

    .dropdown-button:active {
        opacity: .75;
    }



    .closed {
        overflow: hidden;
        height: 25px;
        min-height: 25px;
    }

    .content {
        gap: 4px;
        padding: 4px;
        max-width: 100%;
        overflow: hidden;
        background: var(--pj-background-tertiary);
    }

    .summary {
        min-height: 23px;
        height: 23px;
        border: none;
        border-radius: 3px;
        font-size: 0.7rem;
        font-weight: 500;

        position: relative;
        user-select: none;

        color: var(--pj-color-secondary);
        width: 100%;
        max-width: 100%;
        padding: 0 2px;

        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 2px;
    }

</style>