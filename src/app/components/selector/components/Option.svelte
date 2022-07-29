<script>
    import DataIcon from "./DataIcon.svelte";
    import ToolTip from "../../tooltip/ToolTip.svelte";

    export let type
    export let setState
    export let data
    export let handleChange
    export let state
</script>

<button
        data-closedropdown="-"
        class="option"
        data-highlight={state.registryID === data.registryID ? `-` : undefined}
        on:click={() => {
        setState(data)
        handleChange(data, () => setState({name: "Empty"}))
    }}
>
    <DataIcon state={data} type={type}/>
    <div data-overflow="-">
        {data.name}
    </div>
    <ToolTip content={data.name}/>
</button>

<style>
    .option {
        width: 75px;
        height: 75px;
        outline: none;
        border: var(--pj-border-primary) 1px solid;
        border-radius: 3px;
        display: grid;
        justify-items: center;
        align-content: center;
        gap: 2px;
        font-size: 0.7rem;
        font-weight: 550;
        color: var(--pj-color-secondary);
        text-align: center;
        background: var(--pj-background-secondary);
        cursor: pointer;
    }

    .option:hover {
        background: var(--pj-border-primary);
    }

    .option:active {
        background: var(--pj-border-primary);
        border-color: var(--pj-accent-color);
    }

</style>