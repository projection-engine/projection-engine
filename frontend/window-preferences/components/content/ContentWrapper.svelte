<script>
    import PREFERENCES from "../../static/PREFERENCES";
    import Accordion from "../../../shared/components/accordion/Accordion.svelte";
    import FormPreferences from "./ContentGroup.svelte";
</script>
{#each PREFERENCES as toRender, index}
    <fieldset>
        <legend>{toRender.label}</legend>
        <FormPreferences toRender={toRender}/>
    </fieldset>
{/each}