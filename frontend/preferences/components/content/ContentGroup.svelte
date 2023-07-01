<script>
    import Builder from "./ContentField.svelte"
    import Accordion from "../../../shared/components/accordion/Accordion.svelte"

    export let toRender
</script>
{#each toRender.form as form, i}
    <Accordion title={form.label} startOpen={true}>

        <div data-svelteform="-">
            {#each form.children as field}
                {#if field.divider}
                    <div data-sveltedivider="-"></div>
                {:else}
                    <Builder toRender={field}/>
                {/if}
            {/each}
        </div>
    </Accordion>
{/each}

