<script>
    import Localization from "../../../libs/libs/Localization";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import entityCreationOptions from "../../../templates/entity-creation-options";

    const translate = key => Localization.PROJECT.VIEWPORT[key]

    const options = entityCreationOptions()
</script>

<Dropdown>
    <button slot="button" data-viewbutton="-" style="background: transparent;">
        {translate("ADD")}
        <ToolTip content={translate("ADD_DETAILS")}/>
    </button>

    {#each options as option}
        {#if option.divider}
            <div class={"divider-wrapper"}>
                {option.label}
                <div data-divider="-"></div>
            </div>
        {:else}
            <button
                    on:click={e => {
                        option.onClick()
                        e.currentTarget.closeDropdown?.()
                    }}
            >
                <Icon>{option.icon}</Icon>
                {option.label}
            </button>
        {/if}
    {/each}
</Dropdown>


<style>
    .divider-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        color: var(--pj-color-primary);
        gap: 8px;
        font-size: 0.7rem !important;
        padding: 2px 6px 0;
        overflow: hidden;
    }
</style>