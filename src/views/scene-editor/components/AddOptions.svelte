<script>
    import Localization from "../../../templates/LOCALIZATION_EN";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import entityCreationOptions from "../../../templates/entity-creation-options";
    import getDropdownHeaderStyles from "../../../utils/get-dropdown-header-styles";

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

