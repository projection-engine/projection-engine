<script>
    import viewportContext from "../../../templates/viewport-context";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte"
    import Localization from "../../../templates/LOCALIZATION_EN";

    export let settings
    $: mappedOptions = viewportContext(settings, true)
</script>

<Dropdown styles="width: 250px; max-height: 40vh; overflow-y: auto">
    <button slot="button" data-viewbutton="-" style="background: transparent;">
        {Localization.ENTITY}
    </button>
    {#each mappedOptions as option}
        {#if option.divider}
            <div data-divider="-"></div>
        {:else if !option.children}
            <button on:click={option.onClick || option.callback}>
                <div style="width: 1.1rem"></div>
                {option.label}

            </button>
        {:else if option.children}
            <div class="group">
                <div style="white-space: nowrap; padding-left: 4px">{option.label}</div>
                <div data-divider="-"></div>
            </div>
            {#each option.children as option}
                {#if option.divider}
                    <div data-divider="-"></div>
                {:else if !option.children}
                    <button on:click={option.onClick || option.callback}>
                        <div style="width: 1.1rem"></div>
                        {option.label}
                    </button>
                {/if}
            {/each}
        {/if}
    {/each}
</Dropdown>

<style>
    .group {
        display: flex;
        align-items: center;
        font-size: .7rem;
        gap: 4px
    }
</style>