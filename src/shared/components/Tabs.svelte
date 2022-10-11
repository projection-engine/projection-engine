<script>
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import KEYS from "../../editor/data/KEYS";


    export let addNewTab
    export let removeTab
    export let tabs
    export let currentTab
    export let setCurrentView


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
            <button disabled={tabs.length === 1} on:click={() => removeTab(i)}
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

        border-radius: 3px;
    }

    .view[data-highlight="-"] {
        background: var(--pj-background-primary);
        color: var(--pj-color-secondary);
    }

    .view-input {
        color: var(--pj-color-secondary);
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
        height: 20px;
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
        display: flex;
        align-items: center;
        gap: 2px;
    }
</style>