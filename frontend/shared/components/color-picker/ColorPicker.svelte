<script>
    import Dropdown from "../dropdown/Dropdown.svelte"
    import ToolTip from "../tooltip/ToolTip.svelte"
    import HsvPicker from "./HsvPicker.svelte"


    /** @type {function}*/
    export let submit
    /** @type {string}*/
    export let height = "25px"
    /** @type {number[]}*/
    export let value
    /** @type {number}*/
    export let timeout = 250
    /** @type {string}*/
    export let label
    /** @type {boolean}*/
    export let disabled

    let submitTimeout
    let startColor = [0, 0, 0]

    $: if (value) startColor = [value[0], value[1], value[2]]

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
                if(timeout === 0){
                    startColor = [r,g,b]
                    submit({r,g,b}, startColor)
                }else{
                    clearTimeout(submitTimeout)
                    submitTimeout = setTimeout(() => {
                        startColor = [r,g,b]
                        submit({r,g,b}, startColor)
                    }, timeout)
                }
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
        background: rgba(0,0,0,.65);

        font-size: .7rem;
        position: absolute;
        padding: 0 8px 0 2px;
        width: fit-content;

        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }
</style>


