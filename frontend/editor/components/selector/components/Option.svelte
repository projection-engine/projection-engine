<script>
    import DataIcon from "./DataIcon.svelte"
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte"

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
    $: isSelected = state.registryID !== undefined ? state.registryID === data.registryID : state.id !== undefined && state.id === data.id
</script>

<button data-sveltebuttondefault="-"

        class="option-available-nodes selector"
        style="margin-bottom: 4px;"
        data-sveltehighlight={isSelected ? "-" : undefined}
        on:click={onClick}
>
    <DataIcon state={data} type={type}/>
    <div data-svelteoverflow="-">{data?.name}</div>
    <ToolTip content={data.name}/>
</button>