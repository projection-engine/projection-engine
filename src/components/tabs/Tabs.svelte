<script>
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import KEYS from "../../data/KEYS";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte"
    import {onDestroy, onMount} from "svelte";


    export let addNewTab
    export let removeTab
    export let tabs
    export let currentTab
    export let setCurrentView
    export let allowDeletion
    export let allowRenaming
    export let templates
    export let updateView
    export let disabled

    let ref

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
                if (allowRenaming)
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
            case "wheel":
                e.preventDefault();
                if (ref.scrollWidth > ref.offsetWidth)
                    ref.scrollLeft += e.deltaY;
                break
        }
    }
    onMount(() => {
        ref.addEventListener("wheel", handler);
    })
    onDestroy(() => {
        ref.removeEventListener("wheel", handler);
    })

</script>

<div class="container" bind:this={ref}>
    {#each tabs as v, i}
        <div data-highlight={i === currentTab ? "-" : undefined} class="view">
            {#if v.icon}
                <Dropdown hideArrow={true}>
                    <button slot="button" class="dropdown-button">
                        <Icon styles="font-size: .85rem;">{v.icon}</Icon>
                    </button>
                    {#each templates as item}
                        <button on:click={_ => updateView(item.id, i)}>
                            {#if v.id === item.id}
                                <Icon>check</Icon>
                            {:else}
                                <div style="width: 1.1rem"></div>
                            {/if}
                            {item.name}
                        </button>
                    {/each}
                </Dropdown>
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

    <button on:click={addNewTab} class="add-button">
        <Icon styles="font-size: .9rem">add</Icon>
    </button>

</div>

<style>
    .dropdown-button {
        min-width: 18px;
        min-height: 18px;
        max-width: 18px;
        max-height: 18px;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }

    .view {
        color: var(--pj-color-quaternary);
        display: flex;
        align-items: center;
        overflow: hidden;
        border-top: transparent 2px solid;
        max-height: 30px;
        min-height: 30px;
    }

    .view:hover {
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

    input {
        padding: 0 4px;
    }


    .add-button {
        border: none;
        width: 30px;

        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }

    .container {
        width: 100%;
        background: var(--pj-background-tertiary);
        max-height: 30px;
        min-height: 30px;
        display: flex;
        align-items: center;
        overflow: hidden;
        gap: 2px;
    }
</style>