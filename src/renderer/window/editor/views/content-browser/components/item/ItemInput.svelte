<script>
    import KEYS from "../../../../static/KEYS.ts"

    export let isOnRename
    export let submitRename
    export let data
    export let isRow
</script>


<input
        data-svelteoverflow="-"
        disabled={!isOnRename}
        on:blur={ev => {
            submitRename(ev.currentTarget.value)
        }}
        on:keydown={e => {
            if(e.code === KEYS.Enter)
                submitRename(e.currentTarget.value)
        }}
        value={data.name}
        style={isRow ? "text-align: left" : undefined}
/>

<style>
    input {
        padding: 0 2px;
        border-radius: 3px;
        background: none;
        text-align: center;
        outline: none;
        font-size: .7rem;
        color: var(--pj-color-primary);
        border: var(--pj-border-primary) 1px solid;
        background: rgba(0, 0, 0, .5);
        height: 23px;
    }

    input:disabled {
        border: none;
        background: none;
        color: var(--pj-color-quaternary);
    }
</style>
