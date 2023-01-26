<script lang="ts">
    import ToolTip from "../tooltip/ToolTip.svelte";
    import Dropdown from "./Dropdown.svelte";
    import getDropdownHeaderStyles from "./utils/get-dropdown-header-styles";
    import Icon from "../icon/Icon.svelte";

    export let label: string
    export let labelAsIcon: boolean
    export let autoClose: boolean
    export let options: { label: string, icon?: string, divider?: boolean, onClick: Function }[]
    export let cleanLayout: boolean
    export let tooltip: string
    export let noPadding: boolean
    export let buttonStyles: string

    $: styles = cleanLayout ? undefined : getDropdownHeaderStyles()
</script>

<Dropdown buttonStyles={styles} hideArrow={cleanLayout}>
    <button data-sveltebuttondefault="-"
            slot="button"
            data-svelteview-header-dropdown={cleanLayout? "" : "-"}
            style={buttonStyles + (cleanLayout ? "border: none; display: flex; align-items: center" : undefined)}
    >
        {#if labelAsIcon}
            <Icon>{label}</Icon>
            {#if tooltip}
                <ToolTip content={tooltip}/>
            {/if}
        {:else}
            {label}
            <ToolTip content={label}/>
        {/if}

    </button>

    {#each options as option}
        {#if option.divider}
            <div class="group dropdown-list">
                <strong style="white-space: nowrap; padding-left: 4px">{option.label}</strong>
                <div data-sveltedivider="-"></div>
            </div>
        {:else}
            <button data-sveltebuttondefault="-"
                    disabled={option.disabled}
                    on:click={e => {
                        option.onClick()
                        if(autoClose)
                            e.currentTarget.closeDropdown?.()
                    }}
                    style={noPadding ? undefined : "padding-left: 25px;"}
            >
                {#if option.icon}
                    <Icon>{option.icon}</Icon>
                {:else}
                    <div style="width: 1.1rem"></div>
                {/if}
                {option.label}
            </button>
        {/if}
    {/each}
</Dropdown>

