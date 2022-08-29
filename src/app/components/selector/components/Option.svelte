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
        position: relative;

        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-items: flex-start;
        gap: 2px;
        font-size: 0.7rem;
        font-weight: 550;
        color: var(--pj-color-secondary);
        text-align: center;
        cursor: pointer;
        overflow: hidden;
    }

    .option:hover {
        background: var(--pj-background-secondary);
    }

    .option:active {
        background: var(--pj-background-primary);
    }

</style>