<script>
    import Accordion from "../../../../../components/accordion/Accordion.svelte";
    import ComponentAttribute from "./ComponentAttribute.svelte";

    export let selected
    export let submit
    export let translate
    $: isNative = selected.isNative
</script>

{#if Array.isArray(selected.props)}
    {#each selected.props as propAttr}
        {#if propAttr.type === "group" && Array.isArray(propAttr.children)}
            <Accordion title={isNative ? translate(propAttr.label) : propAttr.label}>
                {#each propAttr.children as attribute}
                    <ComponentAttribute
                            selected={selected}
                            submit={submit}
                            translate={translate}
                            attribute={attribute}
                            isNative={isNative}
                    />
                {/each}
            </Accordion>
        {:else if propAttr.type !== "group"}
            <ComponentAttribute
                    isNative={isNative}
                    selected={selected}
                    submit={submit}
                    translate={translate}
                    attribute={propAttr}
            />
        {/if}
    {/each}
{/if}