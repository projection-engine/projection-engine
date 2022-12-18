<script>
    import viewportContext from "../../../templates/viewport-context";
    import Localization from "../../../templates/LOCALIZATION_EN";
    import getDropdownHeaderStyles from "../../../utils/get-dropdown-header-styles";
    import Dropdown from "../../../../shared/components/dropdown/Dropdown.svelte";

    export let settings
    $: mappedOptions = viewportContext(settings, true)
</script>

<Dropdown styles="width: 250px; max-height: 40vh; overflow-y: auto" buttonStyles={getDropdownHeaderStyles()}>
    <button slot="button" data-view-header-dropdown="-">
        {Localization.OBJECT}
    </button>
    {#each mappedOptions as option}
        {#if option.divider}
            <div data-divider="-"></div>
        {:else if !option.children}
            <button on:click={option.onClick || option.callback} style="padding-left: 25px;">
                {option.label}
            </button>
        {:else if option.children}
            <div class="group dropdown-list">
                <strong style="white-space: nowrap; padding-left: 4px">{option.label}</strong>
                <div data-divider="-"></div>
            </div>
            {#each option.children as option}
                {#if option.divider}
                    <div data-divider="-"></div>
                {:else if !option.children}
                    <button
                            on:click={option.onClick || option.callback}
                            style="padding-left: 25px;"
                    >
                        {option.label}
                    </button>
                {/if}
            {/each}
        {/if}
    {/each}
</Dropdown>
