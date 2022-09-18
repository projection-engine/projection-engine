<script>
    import Icon from "./icon/Icon.svelte";
    import Localization from "../libs/Localization";

    const {shell} = window.require("electron")

    export let tab
    export let setTab
    export let options

</script>

<div class="wrapper">
    {#each options as op, i}
        <button class="button" class:active={tab === i} on:click={() => setTab(i)}>
            {#if Array.isArray(op)}
                <Icon styles="font-size: .9rem">{op[0]}</Icon>
                {op[1]}
            {:else}
                {op}
            {/if}
        </button>
    {/each}

    <div class="version" on:click={() => shell.openExternal("https://github.com/projection-engine")}>
        {Localization.PROJECT.INFO.VERSION}
    </div>
</div>

<style>
    .version {
        position: absolute;
        font-size: .65rem;
        color: var(--pj-color-quinary);
        cursor: pointer;
        bottom: 4px;
        text-align: left;
        width: 100%;
        padding: 0 4px ;
    }
    .version {

    }

    .version:hover {
        text-decoration: underline;
    }

    .wrapper {
        position: relative;
        padding: 4px;
        width: clamp(250px, 15vw, 350px);
        display: grid;
        align-content: flex-start;
        gap: 4px;
        background: var(--pj-background-secondary);
        border-right: var(--pj-border-primary) 1px solid;
        overflow: hidden;
    }

    .button {
        display: flex;
        align-items: center;
        gap: 4px;

        width: 100%;
        height: 35px;

        border: none;
        border-radius: 5px;
        color: var(--pj-color-quaternary);
        font-size: .8rem;
        font-weight: 500;
    }

    .button:hover {
        color: var(--pj-color-primary);
    }

    .active {
        color: var(--pj-color-primary) !important;
        background: var(--pj-background-primary);
    }
</style>