<script>
    import Localization from "../../../templates/LOCALIZATION_EN";
    import entityCreationOptions from "../../../templates/entity-creation-options";
    import getDropdownHeaderStyles from "../../../utils/get-dropdown-header-styles";
    import Dropdown from "../../../../shared/components/dropdown/Dropdown.svelte";
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte";
    import Icon from "../../../../shared/components/icon/Icon.svelte";

    const options = entityCreationOptions()
</script>

<Dropdown buttonStyles={getDropdownHeaderStyles()}>
    <button slot="button" data-view-header-dropdown="-">
        {Localization.ADD}
        <ToolTip content={Localization.ADD_DETAILS}/>
    </button>

    {#each options as option}
        {#if option.divider}
            <div class="group dropdown-list">
                <strong style="white-space: nowrap; padding-left: 4px">{option.label}</strong>
                <div data-divider="-"></div>
            </div>
        {:else}
            <button
                    on:click={e => {
                        option.onClick()
                        e.currentTarget.closeDropdown?.()
                    }}
                    style="padding-left: 25px;"
            >
                <Icon>{option.icon}</Icon>
                {option.label}
            </button>
        {/if}
    {/each}
</Dropdown>

