<script>
    import Dropdown from "../../../../../../components/dropdown/Dropdown.svelte";
    import ToolTip from "../../../../../../components/tooltip/ToolTip.svelte";
    import Icon from "../../../../../../components/Icon/Icon.svelte";

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
    <button slot="button" data-minimal={`${minimal}`} data-highlight={open ? "-" : ""} class={"transformation-wrapper"}>
        <ToolTip content={label}/>
        <slot name="icon"/>
        {#if !minimal}
            <div class={"overflow"}>{label}</div>
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

<style>

    .transformation-wrapper {
        position: relative;

        --color-to-apply: white;

        display: flex;
        align-items: center;
        justify-content: center;
        background: rgb(40 40 40 / 85%);
        height: 35px;
        width: 100%;
        font-size: 0.75rem;
        padding: 0 !important;
        border-radius: 0;
        border: var(--pj-border-primary) 1px solid;
        gap: 8px;
    }

    .transformation-wrapper > span {
        font-size: 1.2rem !important;
        color-rendering: optimizespeed !important;
        shape-rendering: optimizespeed !important;
    }

    .transformation-wrapper[data-highlight="true"] {
        border-color: #0095ff;
    }

    .transformation-wrapper[data-minimal="false"] {
        justify-content: flex-start;
        padding: 8px !important;
        text-align: left;
    }

    .grid-size-header{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 4px;
        margin-bottom: 8px;
        font-size: .75rem;
        color: var(--pj-color-secondary);
    }

    .close-button{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;
        padding: 0;
    }
</style>