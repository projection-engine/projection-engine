<script>

    import Icon from "../Icon/Icon.svelte";

    export let checked
    export let handleCheck
    export let label
    export let disabled
</script>
<div class="wrapper" data-disabled={disabled ? `-` : undefined}>
    <button
            class="container"
            disabled={disabled ? "true" : undefined}
            style={`
                background: ${checked ? "var(--fabric-accent-color)" : undefined};
                border: ${checked ? "var(--fabric-accent-color) 1px solid" : undefined};
            `}
            on:click={() => handleCheck(checked)}>
        <Icon
                styles={`
                color: white;
                visibility: ${checked ? "visible" : "hidden"};
                font-size: 15px;
                font-weight: bold;
                `}
        >
            done
        </Icon>

    </button>
    {label}
</div>
)
}
