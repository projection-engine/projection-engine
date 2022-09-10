<script>
    import ToolTip from "../tooltip/ToolTip.svelte";
    import Icon from "../icon/Icon.svelte";

    export let type = ""
    export let title
    let open = false
</script>


<div class="accordion" style={open ? undefined : "overflow: hidden; height: 25px; min-height: 25px;"}>
    <div class="summary">
        <button class="dropdown-button" on:click={() => open = !open}>
            <Icon styles={`transform: ${open ? "none" : "rotate(-90deg)"}; font-size: 1rem`}>
                expand_more
            </Icon>
        </button>
        {#if title}
            {title}
            <ToolTip content={title}/>
        {:else}
            <slot name="header"/>
        {/if}
    </div>
    <div class="content" style={`display: ${open ? (type ? type : "grid") : "none"}`}>
        <slot/>
    </div>
</div>

<style>
    .dropdown-button{
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
    .dropdown-button:hover{
        opacity: .9;
    }
    .dropdown-button:active{
        opacity: .75;
    }
    .accordion {
        display: grid;

        background-color: var(--pj-background-secondary);
        max-width: 100%;
        user-select: none;
        border-radius: 3px;
    }


    .content {
        gap: 4px;
        padding: 4px;
        max-width: 100%;
        overflow: hidden;
    }

    .summary {
        min-height: 23px;
        height: 23px;
        border: none;
        border-radius: 3px;
        font-size: 0.7rem;
        font-weight: 550;

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