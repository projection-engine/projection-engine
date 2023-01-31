<script>
    import PREFERENCES from "../../static/PREFERENCES";
    import Accordion from "../../../../../../components/accordion/Accordion.svelte";
    import FormPreferences from "./ContentGroup.svelte";
</script>
{#each PREFERENCES as toRender, index}
    <Accordion title={toRender.label}>
        <FormPreferences toRender={toRender}/>
    </Accordion>
{/each}