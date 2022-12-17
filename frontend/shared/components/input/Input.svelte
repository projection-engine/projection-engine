<script>
    import {onMount} from "svelte";

    const DELAY = 250, ENTER = "Enter"
    export let width = "initial"
    export let height = "initial"
    export let onBlur = () => null
    export let noPadding = false
    export let setSearchString = () => null
    export let searchString = ""
    export let noAutoSubmit = false
    export let placeholder = undefined
    export let onEnter = undefined
    export let directChange = undefined
    export let minWidth = undefined
    export let hasBorder = undefined
    export let disabled

    let changed = false
    let timeout, input
    const onChange = (input) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            setSearchString(input.value)
            changed = false
        }, DELAY)
    }
    onMount(() => input.value = searchString)
    $: if (input) input.value = searchString

</script>

<div
        class="wrapper"
        style={`${hasBorder ? "border: var(--pj-border-primary) 1px solid;" : ""} ${minWidth ? `min-width: ${minWidth};` : ""} ${height ? `max-height: ${height};min-height: ${height};` : ""} ${width ? `max-width: ${width};` : ""} ${noPadding ? `noPadding: ${noPadding};` : ""}`}
>
    {#if $$slots.icon}
        <div class="icon-wrapper">
            <slot name="icon"/>
        </div>
    {/if}
    <input
            placeholder={placeholder}
            disabled={disabled}
            draggable={false}
            bind:this={input}
            on:input={e => {
                if(directChange)
                    directChange(e.target.value)
                changed = true
                if(!noAutoSubmit)
                    onChange(e.target)
            }}
            on:blur={(e) => {
                if(onBlur)
                    onBlur(changed, e.currentTarget.value)
            }}
            on:keydown={e => {
                if(e.code === ENTER){
                   setSearchString(e.target.value)
                   if(onEnter)
                        onEnter(e.target.value)
                    changed = false
                }
            }}
    />
</div>

<style>
    .wrapper {
        height: 23px;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 3px;
        overflow: hidden;
        border-radius: 3px;
        width: 100%;
        max-width: 250px;

        background: var(--pj-background-tertiary);
    }

    input {
        font-size: .7rem;
        color: var(--pj-color-quaternary);
        border: none;
        background: transparent;
        outline: none;
        width: 100%;

    }

    input:disabled {
        color: #999;
        cursor: default;
    }

    .icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 25px;
        height: 25px;
    }
</style>