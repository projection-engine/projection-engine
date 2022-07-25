<script>
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";
    import ToolTip from "../../../../../components/tooltip/ToolTip.svelte";
    import Icon from "../../../../../components/Icon/Icon.svelte";

    export let values = []
    export let minimal = true
    export let onSave = () => null
    export let label = ""
    export let initialValue = 0

    let state = initialValue
    let open = false
</script>

<Dropdown

        hideArrow={true}
        onOpen={() => open =true}
        onClose={() => open = false}
>
    <button slot="button" data-minimal={`${minimal}`} data-highlight={open ? "-" : ""} class={"transformationWrapper"}>
        <ToolTip content={label}/>
        <slot name="icon"/>
        {#if !minimal}
            <div class={"overflow"}>{label}</div>
        {/if}
    </button>


    <div class={"gridSizeHeader"}>
        {label}
        <button
                on:click={() => {
                state =initialValue
                onSave(initialValue)
            }}
                style={`
                display: flex;
                justifyContent: center;
                alignItems: center;
                width: 20px;
                height: 20px;
                padding: 0;
            `}
        >
            <Icon styles={{fontSize: "1rem"}}>close</Icon>
        </button>
    </div>
    <div class={"gridSizeItems"}>
        {#each values as e}
            <button
                    style="width: 100%"
                    class={"button"}
                    data-highlight={state === e ? "-" : undefined}
                    on:click={() => {
                    state = e
                    onSave(state)
                }}
            >
                {e}
            </button>
        {/each}
    </div>

</Dropdown>
