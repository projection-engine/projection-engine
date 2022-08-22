<script>
    import Dropdown from "../../../../../../components/dropdown/Dropdown.svelte";
    import ToolTip from "../../../../../../components/tooltip/ToolTip.svelte";
    import Icon from "../../../../../../components/icon/Icon.svelte";
    import "../../css/Viewport.css"

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
    <button slot="button" data-minimal={`${minimal}`} data-highlight={open ? "-" : ""} class={"transformation-wrapper gizmo-bar"} style="border: none">
        <ToolTip content={label}/>
        <slot name="icon"/>
        {#if !minimal}
            <div data-overflow="-">{label}</div>
        {/if}
    </button>


    <div class={"grid-size-header"}>
        {label}
        <button
                on:click={() => {
                state =initialValue
                onSave(initialValue)
            }}
            class="close-button"
        >
            <Icon styles="font-size: 1rem">close</Icon>
        </button>
    </div>
    <div class={"grid-size-items"}>
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

<style>
    .grid-size-header{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 4px;
        font-size: .75rem;
        color: var(--pj-color-secondary);
        padding: 0 4px;
        height: 25px;
    }

    .close-button{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;
        padding: 0;
        border: none;
        --pj-accent-color: #ff5555;
    }
    .grid-size-items{
        display: grid;
        gap: 4px;
        grid-template-rows: repeat(4, 20px);
        grid-template-columns: repeat(2, calc(50% - 4px));
    }
</style>