<script>
    import Icon from "frontend/shared/components/icon/Icon.svelte";
    import KEYS from "../../static/KEYS.ts";
    import Dropdown from "frontend/shared/components/dropdown/Dropdown.svelte"
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
    export let focused

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
        <div
                data-highlight={i === currentTab ? "-" : undefined}
                data-focused={i === currentTab && focused ? "-" : undefined}
                class:view-static={v.icon != null}
                class:view-dynamic={v.icon == null}
        >
            {#if v.icon}
                <Dropdown hideArrow={true}>
                    <button slot="button" class="dropdown-button">
                        <Icon styles={"font-size: .85rem;" + (i === currentTab ? "color: var(--pj-color-primary);" : "")}>{v.icon}</Icon>
                    </button>
                    {#each templates as item}
                        <button on:click={e => {
                            if(e.target.closeDropdown)
                                e.target.closeDropdown()
                            updateView(item.id, i)
                        }}>
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
                    style={i === currentTab ? "color: var(--pj-color-primary);" : undefined}
                    data-view={i}
                    type="button"
                    value={v.name}
            >

            <button
                    disabled={tabs.length === 1 && !allowDeletion}
                    on:click={() => removeTab(i)}
                    class="remove-button"
            >
                <Icon styles="font-size: .8rem">clear</Icon>
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

    .view-static {
        color: var(--pj-color-quaternary);
        display: flex;
        padding-left: 2px;
        align-items: center;
        overflow: hidden;
        border-top: transparent 2px solid;
        max-height: 30px;
        min-height: 30px;
    }

    .view-static:hover {
        color: var(--pj-accent-color);
    }

    .view-static[data-highlight="-"] {
        background: var(--pj-background-quaternary);
    }

    .view-static[data-focused="-"] {
        border-top: white 2px solid !important;
    }

    .view-dynamic {
        color: var(--pj-color-quaternary);
        display: flex;
        align-items: center;
        overflow: hidden;
        max-height: 22px;
        min-height: 22px;
        border-radius: 3px;

    }

    .view-dynamic:hover {
        color: var(--pj-accent-color);
    }

    .view-dynamic[data-highlight="-"] {
        background: var(--pj-accent-color);
        color: white;
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

        max-height: 30px;
        min-height: 30px;
        display: flex;
        align-items: center;
        overflow: hidden;
        gap: 2px;
    }
</style>

