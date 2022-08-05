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
    <div data-overflow="-" class="label" >
        {data.name}
    </div>
    <ToolTip content={data.name}/>
</button>

<style>
    .label{
        max-width: 100%;
        position: absolute;
        z-index: 10;
        bottom: 4px;
        width: 100%;
        text-align: center;
        padding: 0 4px;
    }
    .option {
        position: relative;

        width: var(--card-size);
        height: var(--card-size);
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
        cursor: pointer;

        overflow: hidden;
    }

    .option:hover {
        border-color: var(--pj-accent-color);
    }

    .option:active {
        transform:scale(.99);
        border-color: var(--pj-accent-color);
    }

</style>