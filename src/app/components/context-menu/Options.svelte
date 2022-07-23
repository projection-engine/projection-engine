<script>
    import Icon from "../Icon/Icon.svelte";
    import {onMount} from "svelte";
    import Shortcut from "./Shortcut.svelte";

    let options = []
    let selected
    let trigger
    let event
    let close =  () => null
    let callback = () => null
    onMount(() => callback())
    $: optionsToRender = options.filter(o => !o.requiredTrigger || o.requiredTrigger === trigger)
</script>

<div style={{overflowY: "auto", maxHeight: "265px"}}>
    {#each optionsToRender as option}
        {#if option.divider}
            <div class="divider"></div>
        {:else}
            <button
                disabled={option.disabled}
                class="button"
                onClick={() => {
                    option.onClick(selected, event)
                    close()
                }}
            >
                <div class="inline">
                    <div class="icon">
                        {#if option.icon}
                            <Icon styles="font-size: 1.1rem">{option.icon}</Icon>
                        {/if}
                    </div>
                    <label class="overflow">{option.label}</label>
                </div>
                <Shortcut shortcut={option.shortcut}/>
            </button>
        {/if}
    {/each}

</div>