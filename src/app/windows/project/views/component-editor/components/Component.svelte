<script>
    import Accordion from "../../../../../components/accordion/Accordion.svelte";
    import ComponentAttribute from "./ComponentAttribute.svelte";

    export let selected
    export let submit
    export let translate

</script>

{#if Array.isArray(selected.props)}
    {#each selected.props as propAttr}
        {#if propAttr.type === "group" && Array.isArray(propAttr.children)}
            <Accordion title={translate(propAttr.label)}>
                {#each propAttr.children as attribute}
                    <ComponentAttribute
                            selected={selected}
                            submit={submit}
                            translate={translate}
                            attribute={attribute}
                    />
                {/each}
            </Accordion>
        {:else if propAttr.type !== "group"}
            <ComponentAttribute
                    selected={selected}
                    submit={submit}
                    translate={translate}
                    attribute={propAttr}
            />
        {/if}
    {/each}
{/if}