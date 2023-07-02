<script>
    import PREFERENCES from "../../static/PREFERENCES"
    import ContentGroup from "./ContentGroup.svelte"
    import PropertyHeader from "../../../shared/components/PropertyHeader.svelte"

    export let tab
</script>

{#if PREFERENCES[tab + 2]}
    <PropertyHeader title={PREFERENCES[tab+ 2].label}/>
    <ContentGroup toRender={PREFERENCES[tab + 2]}/>
{/if}
