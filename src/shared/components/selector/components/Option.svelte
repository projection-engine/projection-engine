<script>
    import DataIcon from "./DataIcon.svelte";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";

    export let type
    export let setState
    export let data
    export let handleChange
    export let state

    const onClick = e => {
        e.currentTarget?.parentElement?.parentElement?.parentElement?.closeDropdown?.()
        setState(data)
        if(handleChange)
            handleChange(data, () => setState({name: "Empty"}))
    }
</script>

<button

        class="option-available-nodes selector"
        style="margin-bottom: 4px;"
        data-highlight={state.registryID === data.registryID ? `-` : undefined}
        on:click={onClick}
>
    <DataIcon state={data} type={type}/>
    <div data-overflow="-">
        {data.name}
    </div>
    <ToolTip content={data.name}/>
</button>