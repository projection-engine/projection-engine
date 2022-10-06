<script>
    import {KEYS} from "../../../../../../public/engine/production";

    export let isOnRename
    export let submitRename
    export let data
    export let isRow
</script>


<input
        disabled={!isOnRename}
        on:change={e => submitRename(e.currentTarget.value)}
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
        backdrop-filter: brightness(50%);
        height: 23px;
    }

    input:disabled {
        border: none;
        backdrop-filter: none;
        color: var(--pj-color-quaternary);
    }
</style>