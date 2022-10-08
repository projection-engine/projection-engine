<script>
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";

    export let checked
    export let handleCheck
    export let label
    export let disabled
</script>
<div class="wrapper" data-disabled={disabled ? `-` : undefined}>
    <button
            class="container"
            disabled={disabled}
            style={`
                background: ${checked ? "var(--pj-accent-color)" : undefined};
                border: ${checked ? "var(--pj-accent-color) 1px solid" : undefined};
                opacity: ${disabled ? ".5" : "1"};
            `}
            on:click={() => handleCheck(checked)}>
        <Icon
                styles={`
                color: white;
                visibility: ${checked ? "visible" : "hidden"};
                font-size: 13px;
                font-weight: bold;
                `}
        >
            done
        </Icon>

    </button>
    {label}
</div>

<style>
    .container {
        outline: none;

        border: var(--pj-color-tertiary) 1px solid;
        width: 13px;
        height: 13px;

        border-radius: 50%;
        background: transparent;
        transition: 150ms linear;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

    }
    .container:hover {
        border: var(--pj-accent-color) 1px solid;
    }

    .container:active {
        background: var(--pj-background-quaternary);
        border: var(--pj-accent-color) 1px solid;
    }

    .container:disabled {
        background: transparent;
        border-color: var(--pj-color-quaternary);
        cursor: unset;
    }
    .wrapper{
        height: 23px;
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: .7rem;
        border-radius: 3px;
        width: 100%;
        padding: 4px;
        font-weight: 550;
        color: var(--pj-color-tertiary);
    }
</style>