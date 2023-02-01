<script>
    import Builder from "./ContentField.svelte";
    import SettingsStore from "../../../../stores/SettingsStore";
    import VisualsStore from "../../../../stores/VisualsStore";
    import {onDestroy} from "svelte";

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
<fieldset>
    <legend>{form.label}</legend>
    <div data-svelteform="-">
        {#each form.children as field}
            {#if field.divider}
                <div data-sveltedivider="-"></div>
            {:else}
            <Builder toRender={field} visuals={visuals} settings={settings}/>
            {/if}
        {/each}
    </div>
</fieldset>
{/each}
<style>
    fieldset {
        background: none;
        border-radius: 0;
        border-top: var(--pj-border-primary) 1px solid;
    }
    legend{
        padding: 0 8px;
    }
</style>