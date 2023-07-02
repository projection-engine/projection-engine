<script>
    import PREFERENCES from "../../static/PREFERENCES"
    import ContentGroup from "./ContentGroup.svelte"
    import PropertyHeader from "../../../shared/components/PropertyHeader.svelte"

    export let tab
</script>

{#if PREFERENCES[tab]}
    <PropertyHeader title={PREFERENCES[tab].label}/>
    <ContentGroup toRender={PREFERENCES[tab]}/>
{/if}
