<script>
    import Builder from "./ContentField.svelte";
    import SettingsStore from "../../../shared/stores/SettingsStore";
    import VisualsStore from "../../../shared/stores/VisualsStore";
    import {onDestroy} from "svelte";
    import Accordion from "../../../shared/components/accordion/Accordion.svelte";

    export let toRender

    let settings
    let visuals

    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    const unsubscribeVisuals = VisualsStore.getStore(v => visuals = v)

    onDestroy(() => {
        unsubscribeSettings()
        unsubscribeVisuals()
    })
</script>
{#each toRender.form as form, i}
    <Accordion title={form.label} startOpen={true}>

        <div data-svelteform="-">
            {#each form.children as field}
                {#if field.divider}
                    <div data-sveltedivider="-"></div>
                {:else}
                    <Builder toRender={field} visuals={visuals} settings={settings}/>
                {/if}
            {/each}
        </div>
    </Accordion>
{/each}

