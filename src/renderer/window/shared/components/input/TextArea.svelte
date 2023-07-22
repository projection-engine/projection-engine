<script>
    import {onMount} from "svelte"

    const DELAY = 250

    export let placeholder = ""
    export let setValue
    export let value = ""

    let timeout, input
    const onChange = () => {
    	clearTimeout(timeout)
    	timeout = setTimeout(() => setValue(input.value), DELAY)
    }
    onMount(() => input.value = value)
    $: if(input) input.value = value

</script>

<textarea
        placeholder={placeholder}
        draggable={false}
        bind:this={input}
        on:input={e => onChange(e.target)}
></textarea>

<style>
    textarea {
        height: 23px;
        min-height: 23px;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 3px;
        overflow-y: auto;
        border-radius: 3px;
        width: 100%;
        max-width: 250px;
        color: var(--pj-color-secondary);
        background: var(--pj-background-tertiary);
        font-size: .7rem !important;
        border: var(--pj-border-primary) 1px solid;
        resize: vertical;
    }
</style>