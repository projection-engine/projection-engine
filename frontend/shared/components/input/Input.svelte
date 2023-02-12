<script lang="ts">
    import {onMount} from "svelte";

    const DELAY = 250, ENTER = "Enter"
    export let width:string
    export let height:string
    export let onBlur:Function
    export let onChange:Function
    export let inputValue:string
    export let noAutoSubmit = false
    export let placeholder = undefined
    export let onEnter = undefined
    export let directChange = undefined
    export let minWidth = undefined
    export let hasBorder = undefined
    export let disabled:boolean

    let changed = false
    let timeout:NodeJS.Timeout
    let input:HTMLInputElement

    const handler = (input) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            onChange?.(input.value)
            changed = false
        }, DELAY)
    }
    onMount(() => input.value = inputValue|| "")
    $: if (input) input.value = inputValue|| ""

</script>

<div
        class="wrapper"
        class:with-label={$$slots.label != null}
        style={`${minWidth ? `min-width: ${minWidth};` : ""} ${width ? `max-width: ${width};` : ""} `}
>
    {#if $$slots.icon}
        <div class="icon-wrapper">
            <slot name="icon"/>
        </div>
    {/if}
    {#if $$slots.label}
        <slot name="label"/>
    {/if}
    <input
            style={`${hasBorder ? "border: var(--pj-border-primary) 1px solid;" : ""} ${height ? `max-height: ${height};min-height: ${height};` : ""}`}
            placeholder={placeholder||""}
            disabled={disabled}
            draggable="false"
            bind:this={input}
            on:input={e => {
                directChange?.(e.target.value)
                changed = true
                if(!noAutoSubmit)
                    handler(e.target)
            }}
            on:blur={(e) => onBlur?.(changed, e.currentTarget.value)}
            on:keydown={e => {
                if(e.code === ENTER){
                    onEnter?.(e.target.value)
                    changed = false
                }
            }}
    />
</div>

<style>
    .with-label{
        display: grid !important;
        align-items: unset;
        height: fit-content !important;
    }
    .wrapper {
        height: 23px;
        display: flex;
        align-items: center;
        padding: 3px 0;
        gap: 2px;
        overflow: hidden;
        border-radius: 3px;
        width: 100%;
        max-width: 250px;


    }

    input {
        background: var(--pj-background-tertiary);
        font-size: .7rem;
        color: var(--pj-color-quaternary);
        border: none;
        outline: none;
        width: 100%;
        border-radius: 3px;

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