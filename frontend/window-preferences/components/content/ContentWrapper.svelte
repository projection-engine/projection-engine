<script>
    import PREFERENCES from "../../static/PREFERENCES";
    import Accordion from "../../../shared/components/accordion/Accordion.svelte";
    import FormPreferences from "./ContentGroup.svelte";
    export let tab
    $: currentTab = PREFERENCES[tab]
</script>

<h3>{currentTab.label}</h3>
<FormPreferences toRender={currentTab}/>

<style>
    h3{
        padding: 0 8px;
        margin: 8px 0;
        font-weight: 550;
    }
</style>