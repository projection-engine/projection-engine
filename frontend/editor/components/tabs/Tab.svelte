<script lang="ts">
    import Dropdown from "../../../shared/components/dropdown/Dropdown.svelte";
    import TabData from "./TabData";
    import ColorPicker from "../../../shared/components/color-picker/ColorPicker.svelte";
    import Icon from "../../../shared/components/icon/Icon.svelte";
    import LOCALIZATION_EN from "../../templates/LOCALIZATION_EN";
    import ViewTabItem from "../../templates/ViewTabItem";

    export let handler: Function
    export let removeTab: Function
    export let tabs: TabData[]
    export let currentTab: number
    export let allowDeletion: boolean
    export let allowRenaming: boolean
    export let templates: { id: string, name: string }[]
    export let updateView: Function
    export let disabled: boolean
    export let focused: boolean
    export let value: ViewTabItem
    $: spplitedTemplates = templates ? templates.reduce((all, one, i) => {
        const ch = Math.floor(i / 2);
        all[ch] = [].concat((all[ch] || []), one);
        return all
    }, []) : undefined

    let color = value?.color || [255, 255, 255]
    $: colorValue = `--tab-color: rgb(${color})`

</script>
<div
        data-type={value.type}
        data-highlight={value.originalIndex === currentTab ? "-" : undefined}
        data-focused={value.originalIndex === currentTab && focused ? "-" : undefined}
        style={colorValue}
        class:view-static={value.icon != null}
        class:view-dynamic={value.icon == null}
>
    {#if !allowRenaming}
        <Dropdown hideArrow={true}
                  styles="width: 350px; overflow: hidden; padding: 4px; display: flex; flex-direction: column">
            <button slot="button" class="dropdown-button">
                <Icon styles={"font-size: .85rem;" + (value.originalIndex === currentTab ? "color: var(--tab-color);" : "")}>{value.icon}</Icon>
            </button>
            <fieldset>
                <legend>{LOCALIZATION_EN.COLOR}</legend>
                <ColorPicker
                        label={LOCALIZATION_EN.TAB_COLOR}
                        value={color}
                        submit={(_, arr) => {
                            value.color = arr
                            color = arr
                        }}
                />
            </fieldset>
            <fieldset>
                <legend>{LOCALIZATION_EN.VIEWS}</legend>
                {#each spplitedTemplates as items}
                    <div class="row">
                        {#each items as item}
                            <button
                                    data-highlight={value.type === item.id ? "-" : ""}
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
            data-view={value.originalIndex}
            type="button"
            value={value.name}
    >

    <button
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

    .view-static[data-highlight="-"] {
        background: var(--pj-background-quaternary);
    }

    .view-static[data-focused="-"] {
        border-top: var(--tab-color) 2px solid !important;
    }

    .view-dynamic {
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

    .view-dynamic[data-highlight="-"] {
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