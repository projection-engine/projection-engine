<script>
    import Dropdown from "../../../../shared/components/dropdown/Dropdown.svelte"
    import ColorPicker from "../../../../shared/components/color-picker/ColorPicker.svelte"
    import Icon from "../../../../shared/components/icon/Icon.svelte"
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"

    /** @type {function} */
    export let handler
    /** @type {function} */
    export let removeTab
    /** @type {{icon: string, id: string, name:string, index: number, originalIndex: number}[]} */
    export let tabs
    /** @type {number} */
    export let currentTab
    /** @type {boolean} */
    export let allowDeletion
    /** @type {boolean} */
    export let allowRenaming
    /** @type {{ id: string, name: string }[]} */
    export let templates
    /** @type {function} */
    export let updateView
    /** @type {boolean} */
    export let focused
    /** @type {ViewTabItem} */
    export let value
    let organizedTemplates
    $: {
    	if (templates != null)
    		organizedTemplates = templates.reduce((all, one, i) => {
    			const ch = Math.floor(i / 2)
    			all[ch] = all[ch] || []
    			all[ch].push(one)
    			return all
    		}, [])
    }

    let color = value?.color || [255, 255, 255]

</script>
<div
        data-sveltetype={value.type}
        data-sveltehighlight={value.originalIndex === currentTab ? "-" : undefined}
        data-sveltefocused={value.originalIndex === currentTab && focused ? "-" : undefined}
        style={`--tab-color: rgb(${color})`}
        class:view-static={value.icon != null}
        class:view-dynamic={value.icon == null}
>
    {#if !allowRenaming}
        <Dropdown hideArrow={true}
                  styles="width: 350px; overflow: hidden; padding: 4px; display: flex; flex-direction: column">
            <button data-sveltebuttondefault="-" slot="button" class="dropdown-button">
                <Icon styles={"font-size: .85rem;" + (value.originalIndex === currentTab ? "color: var(--tab-color);" : "")}>{value.icon}</Icon>
            </button>
            <fieldset>
                <legend>{LocalizationEN.COLOR}</legend>
                <ColorPicker
                        label={LocalizationEN.TAB_COLOR}
                        value={color}
                        submit={(_, arr) => {
                            value.color = arr
                            color = arr
                        }}
                />
            </fieldset>
            <fieldset>
                <legend>{LocalizationEN.VIEWS}</legend>
                {#each organizedTemplates as items}
                    <div class="row">
                        {#each items as item}
                            <button data-sveltebuttondefault="-"
                                    data-sveltehighlight={value.type === item.id ? "-" : ""}
                                    class="button"
                                    on:click={e => {
                                        e.target.closeDropdown?.()
                                        updateView(item.id, value.originalIndex)
                                    }}
                            >
                                {item.name}
                            </button>
                        {/each}
                    </div>
                {/each}
            </fieldset>
        </Dropdown>
    {/if}

    <input
            on:dblclick={e => handler(e, value)}
            on:input={e => handler(e, value)}
            on:keydown={e => handler(e, value)}
            on:blur={e => handler(e, value)}
            on:click={e => handler(e, value, value.originalIndex)}
            class="view-input"
            style={value.originalIndex === currentTab ? "color: var(--pj-color-primary);" : undefined}
            data-svelteview={value.originalIndex}
            type="button"
            value={value.name}
    >

    <button data-sveltebuttondefault="-"
            data-svelteclosebuttontab='{value.originalIndex}'
            disabled={tabs.length === 1 && !allowDeletion}
            on:click={() => removeTab(value.originalIndex)}
            class="remove-button"
    >
        <Icon styles="font-size: .8rem">clear</Icon>
    </button>
</div>

<style>

    .dropdown-button {
        min-width: 18px;
        min-height: 18px;
        max-width: 18px;
        max-height: 18px;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }

    .view-static {
        flex-shrink: 0;
        --tab-color: white;
        color: var(--pj-color-quaternary);
        display: flex;
        padding-left: 2px;
        align-items: center;
        overflow: hidden;
        border-top: transparent 2px solid;
        max-height: 30px;
        min-height: 30px;
    }

    .view-static:hover {
        color: var(--pj-accent-color);
    }

    .view-static[data-sveltehighlight="-"] {
        background: var(--pj-background-quaternary);
    }

    .view-static[data-sveltefocused="-"] {
        border-top: var(--tab-color) 2px solid !important;
    }

    .view-dynamic {
        flex-shrink: 0;
        color: var(--pj-color-quaternary);
        display: flex;
        align-items: center;
        overflow: hidden;
        max-height: 22px;
        min-height: 22px;
        border-radius: 3px;

    }

    .view-dynamic:hover {
        color: var(--pj-accent-color);
    }

    .view-dynamic[data-sveltehighlight="-"] {
        background: var(--pj-accent-color);
        color: white;
    }

    .view-input {
        color: var(--pj-color-quaternary);
        background: transparent;
        border: none;
        outline: none;

    }

    .remove-button {
        --pj-accent-color: #ff5555;
        border: none;
        padding: 0;
        background: transparent;
        width: 23px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    input, button {
        height: 30px;
        font-size: .7rem;
        border-radius: 3px;
    }

    input {
        padding: 0 4px;
    }


    fieldset {
        background: var(--pj-background-primary);
    }

    .button {
        background: var(--pj-background-primary);
        text-align: left;
    }

    .row {
        width: 100%;
        gap: 3px;
        display: flex;
        height: 25px;
    }

    .row > button {
        width: 100%;
        height: 100%;
    }

</style>