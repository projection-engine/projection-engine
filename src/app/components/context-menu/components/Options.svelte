<script>
    import Icon from "../../Icon/Icon.svelte";
    import {onMount} from "svelte";
    import Shortcut from "./Shortcut.svelte";

    export let options = []
    export let selected
    export let trigger
    export let event
    export let close = () => null
    export let callback = () => null

    let mounted = false
    onMount(() => callback())
    $: callback(selected)
    $: optionsToRender = options.filter(o => !o.requiredTrigger || o.requiredTrigger === trigger)

</script>


{#each optionsToRender as option}
    {#if option.divider}
        <div class="divider"></div>
    {:else}
        <button
                disabled={option.disabled ? true : undefined}
                class="button"
                on:click={() => {
            option.onClick(selected, event)
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
            <Shortcut shortcut={option.shortcut}/>
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


</style>