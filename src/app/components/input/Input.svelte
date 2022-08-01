<script>
    import {onMount} from "svelte";

    const DELAY = 250, ENTER = "Enter"
    export let width = "initial"
    export let height= "initial"
    export let onBlur = () => null
    export let noPadding = false
    export let setSearchString = () => null
    export let searchString = ""
    export let noAutoSubmit = false
    export let placeholder = ""
    export let onEnter = () => null

    let changed = false
    let timeout, input
    const onChange = (input) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            setSearchString(input.value)
            changed = false
        }, DELAY)
    }
    const updateInput = (s=searchString) => {
        if(s)
            input.value= s
    }
    onMount(updateInput)
    $: if(input) input.value = searchString
</script>

<div
    class="wrapper"
    style="width: {width}; height: {height}; padding: {noPadding ? 0 : "initial"}"
>
    {#if $$slots.icon}
        <div class="icon-wrapper">
            <slot name="icon"/>
        </div>
    {/if}
    <input
        placeholder={placeholder}
        class="input"
        bind:this={input}
        on:input={e => {
            changed = true
            if(!noAutoSubmit)
                onChange(e.target)
        }}
        on:blur={(e) => {
            console.log(changed)
            if(onBlur)
            onBlur(changed, e.currentTarget.value)
        }}
        on:keydown={e => {
            if(e.code === ENTER){
               setSearchString(e.target.value)
                onEnter(e.target.value)
                changed = false
            }
        }}
    />
</div>

<style>
    .wrapper {
        height: 23px;
        min-height: 23px;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 3px;
        overflow: hidden;
        border-radius: 3px;
        width: 100%;
        max-width: 250px;
        color: var(--pj-color-secondary);
        background: var(--pj-background-tertiary);
    }

    .input {
        font-size: .7rem;
        border-radius: 5px;
        border: none;
        background: transparent;
        outline: none;
        width: 100%;
        color: var(--pj-color-secondary);
    }
    .icon-wrapper{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 25px;
        height: 25px;
    }
</style>