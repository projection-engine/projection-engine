<script>
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import KEYS from "../../data/KEYS";


    export let addNewTab
    export let removeTab
    export let tabs
    export let currentTab
    export let setCurrentView
    export let allowDeletion

    const handler = (e, v, i) => {
        switch (e.type) {
            case "keydown": {
                if
                (e.code !== KEYS.Enter)
                    break
                v.name = e.target.value
                e.currentTarget.type = "button"
                break
            }
            case "dblclick": {
                e.currentTarget.type = "text"
                break
            }
            case "input":
                v.name = e.target.value
                break
            case "blur":
                e.currentTarget.type = "button"
                break
            case "click":
                setCurrentView(i)
                break
        }
    }

</script>

<div class="container">
    {#each tabs as v, i}
        <div data-highlight={i === currentTab ? "-" : undefined} class="view">
            {#if v.icon}
                <Icon styles="margin-left: 3px; font-size: .85rem; width: .85rem">{v.icon}</Icon>
            {/if}
            <input
                    on:dblclick={e => handler(e, v)}
                    on:input={e => handler(e, v)}
                    on:keydown={e => handler(e, v)}
                    on:blur={e => handler(e, v)}
                    on:click={e => handler(e, v, i)}
                    class="view-input"
                    data-view={i}
                    type="button"
                    value={v.name}
            >
            <button disabled={tabs.length === 1 && !allowDeletion} on:click={() => removeTab(i)}
                    class="remove-button">
                <Icon styles="font-size: .8rem">
                    clear
                </Icon>
            </button>
        </div>
    {/each}
    {#if tabs.length < 10}
        <button on:click={addNewTab} class="add-button">
            <Icon styles="font-size: .9rem">
                add
            </Icon>
        </button>
    {/if}
</div>

<style>
    .view {
        color: var(--pj-color-quaternary);
        display: flex;
        align-items: center;
        overflow: hidden;
        border-top: transparent 2px solid;
        max-height: 30px;
        min-height: 30px;
    }
    .view:hover{
        color: var(--pj-accent-color);
    }

    .view[data-highlight="-"] {
        border-top: white 2px solid !important;
        background: var(--pj-background-secondary);
        color: var(--pj-color-primary);
    }

    .view-input {
        color: var(--pj-color-quaternary);
        background: transparent;
        border: none;
        outline: none;

    }

    .remove-button {
        --pj-accent-color: #ff5555;
        border: none;
        padding: 0;
        background: transparent;
        width: 23px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    input, button {
        height: 30px;
        font-size: .7rem;
        border-radius: 3px;
    }

    .add-button {
        border: none;
        width: 23px;

        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }

    .container {
        background: var(--pj-background-tertiary);
        max-height: 30px;
        min-height: 30px;
        display: flex;
        align-items: center;
        gap: 2px;
    }
</style>