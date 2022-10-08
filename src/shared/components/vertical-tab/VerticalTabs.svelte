<script>
    import ResizableBar from "shared-resources/frontend/components/resizable/ResizableBar.svelte";

    export let globalStyle = ""
    export let initialTab = -1
    export let absolute = true
    export let tabs = []
    let tab = initialTab !== undefined ? initialTab : -1
</script>

{#if tab > -1 && tabs[tab] && !tabs[tab].disabled}
    {#if absolute}
        <div class={"content-wrapper"} style="{globalStyle}">
            <div style="max-width: 0"></div>
            <ResizableBar
                type={"width"}
            />
            <div class={"content"}>
                <svelte:component this={tabs[tab].component} {...tabs[tab].props}/>
            </div>
        </div>
    {:else}
        <ResizableBar
                type={"width"}
        />
        <svelte:component this={tabs[tab].component} {...tabs[tab].props}/>
    {/if}
{/if}
<div
        class="bar"

        style={!absolute ?  "position: relative" : undefined}
>
    {#each tabs as option, i}
        <button
            disabled={option.disabled}

            data-highlight={tab === i ? "-" : ""}
            class={"button"}
            on:click={() => {
                if (tab === i)
                    tab = -1
                else
                    tab = i
            }}
        >
            <div class="label">
            {option.label}
            </div>
        </button>
    {/each}
</div>

<style>
    .bar {
        padding: 4px 0;
        min-width: 23px;
        max-width: 23px;
        background: var(--pj-background-tertiary);
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-end;
        gap: 4px;

    }


    .button {
        width: 20px;
        height: fit-content;
        border-radius: 0 3px 3px 0;
        background: var(--pj-border-primary);
        padding: 4px 0 !important;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .label {
        writing-mode: vertical-rl;
        text-orientation: mixed;
        transform: rotate(180deg);
    }

    .content {
        color: var(--pj-color-secondary);
        padding: 4px;
        background: var(--pj-background-primary);
        border-radius: 3px;
        width: 250px;
        display: grid;
        gap: 4px;
        min-width: 50px;
        overflow: hidden;
        box-shadow: var(--pj-boxshadow);
    }

    .content-wrapper {
        display: flex;
        position: absolute;
        z-index: 9999;
        right: 30px;
        bottom: 4px;
    }

</style>