<script>
    import ToolTip from "../tooltip/ToolTip.svelte";
    import Dropdown from "./Dropdown.svelte";
    import getDropdownHeaderStyles from "./utils/get-dropdown-header-styles";
    import Icon from "../icon/Icon.svelte";

    export let label//: string
    export let labelAsIcon//: boolean
    export let autoClose//:boolean
    export let options//:{label:string, icon?:string, divider?:boolean,onClick:Function}[]
    export let cleanLayout
    export let tooltip

    $: styles = cleanLayout ? undefined : getDropdownHeaderStyles()
</script>

<Dropdown buttonStyles={styles} hideArrow={cleanLayout}>
    <button
            slot="button"
            data-view-header-dropdown={cleanLayout? "" : "-"}
            style={cleanLayout ? "border: none; display: flex; align-items: center" : undefined}
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
                <div data-divider="-"></div>
            </div>
        {:else}
            <button
                    on:click={e => {
                        option.onClick()
                        if(autoClose)
                            e.currentTarget.closeDropdown?.()
                    }}
                    style="padding-left: 25px;"
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

