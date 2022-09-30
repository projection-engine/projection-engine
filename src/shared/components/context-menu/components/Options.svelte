<script>
    import Icon from "../../icon/Icon.svelte";
    import {onMount} from "svelte";
    import Shortcut from "./Shortcut.svelte";

    export let options = []
    export let onFocus
    export let selected
    export let trigger
    export let event
    export let metadata
    export let close = () => null
    export let callback = () => null

    let mounted = false
    $: {
        if (onFocus != null && options && !isSubMenu)
            onFocus(trigger, selected, event)
        callback()
    }
    onMount(() => callback())
    let optionsToRender
    let isSubMenu = false
    let parentLabel
    $: optionsToRender = options.filter(o => !o.requiredTrigger || o.requiredTrigger === trigger)

</script>

<div class="title">
    <Icon styles="font-size: .9rem">{metadata.icon}</Icon>
    <small>{metadata.label}</small>
</div>
{#if isSubMenu}
    <button
            class="button"
            on:click={() => {
                    isSubMenu = false
                    optionsToRender = options.filter(o => !o.requiredTrigger || o.requiredTrigger === trigger)
                    parentLabel = false
                }}
    >
        <div class="inline">
            <div class="icon">
                <Icon>chevron_left</Icon>
            </div>
            <div data-overflow="-">{parentLabel}</div>
        </div>
    </button>
{/if}
{#each optionsToRender as option}
    {#if option.divider}
        <div class="divider"></div>
    {:else}
        <button
                disabled={option.disabled ? true : undefined}
                class="button"
                on:click={() => {
                    if(option.children){
                        optionsToRender = option.children
                        isSubMenu = true
                        parentLabel = option.label
                        return
                    }
                    const callback = option.onClick ? option.onClick : option.callback
                    if(!callback)
                        return
                    callback(selected, event)
                    close()
                }}
        >
            <div class="inline">
                <div class="icon">
                    {#if option.icon}
                        <Icon>{option.icon}</Icon>
                    {/if}
                </div>
                <div data-overflow="-">{option.label}</div>
            </div>
            {#if option.children}
                <div class="icon">
                    <Icon>chevron_right</Icon>
                </div>
            {:else}
                <Shortcut shortcut={option.require}/>
            {/if}

        </button>
    {/if}
{/each}

<style>
    .button {
        border: none;
        width: 100%;
        height: 25px;
        padding: 0 2px !important;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 0.7rem;
    }

    .icon {
        min-width: 25px;
        max-width: 25px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .divider {
        width: 100%;
        background: var(--pj-border-primary);
        height: 1px;
    }


    .inline {
        width: 100%;
        display: flex;
        align-items: center;
    }

    .title {
        background: var(--pj-background-secondary);
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: .85rem;
        height: 25px;
        padding: 0 4px;
        width: 100%;
        position: sticky;
        top: 0;
        border-bottom: var(--pj-border-primary) 1px solid;
    }
</style>