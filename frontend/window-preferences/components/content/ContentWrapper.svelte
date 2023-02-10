<script>
    import PREFERENCES from "../../static/PREFERENCES";
    import ContentGroup from "./ContentGroup.svelte";
    import PropertyHeader from "../../../shared/components/PropertyHeader.svelte";

    export let tab
    $: currentTab = PREFERENCES[tab]
</script>

{#if currentTab}
    <PropertyHeader title={currentTab.label}/>
    <ContentGroup toRender={currentTab}/>
{/if}
<style>
    h3 {
        padding: 0 8px;
        margin: 8px 0;
        font-weight: 550;
    }
</style>