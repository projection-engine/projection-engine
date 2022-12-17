<script>
    import Dropdown from "../dropdown/Dropdown.svelte";
    import ToolTip from "../tooltip/ToolTip.svelte";
    import HsvPicker from "./HsvPicker.svelte";


    let changed = false

    export let submit
    export let height = "25px"
    export let value
    export let label
    export let disabled

    let startColor = [0, 0, 0]
    let initializationChanged

    $: {
        if (value && !initializationChanged) {
            startColor = [value[0], value[1], value[2]]
            initializationChanged = false
        }
    }
</script>


<Dropdown
        hideArrow="true"
        width="100%"
        styles="width: fit-content; overflow: hidden; box-shadow: var(--pj-boxshadow);"
        disabled={disabled}
>
    <div
            slot="button"
            style={(disabled ? "cursor: default;" : "") + `min-height: ${height};max-height: ${height}; background: ${!disabled ? `rgb(${startColor[0]}, ${startColor[1]}, ${startColor[2]})` : "transparent"};`}
            class="dropdown"
    >
        {#if label}
            <div class="label">{label}</div>
            <ToolTip content={label}/>
        {/if}
    </div>
    <HsvPicker
            startColor={startColor}
            submit={({r,g,b}) => {
                startColor = [r,g,b]
                submit({r,g,b})
            }}
    />
</Dropdown>
<style>


    .dropdown {
        border-radius: 3px;
        overflow: hidden;
        width: 100%;
        cursor: pointer;
        transition: 150ms linear;
        position: relative;
        border: var(--pj-border-primary) 1px solid;
    }

    .dropdown:hover {
        opacity: .9;
    }

    .label {
        backdrop-filter: blur(10px) brightness(65%);

        font-size: .7rem;
        position: absolute;
        padding: 0 8px 0 2px;
        width: fit-content;
        font-weight: 550;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }
</style>


