<script>
    import ContentField from "./ContentField.svelte"
    import Accordion from "../../../shared/components/accordion/Accordion.svelte"
    import {onDestroy, onMount} from "svelte"
    import VisualsStore from "../../../shared/stores/VisualsStore"
    import SettingsStore from "../../../shared/stores/SettingsStore"

    const COMPONENT_ID = crypto.randomUUID()
    export let toRender

    let settings
    let visualSettings

    onMount(() => {
    	VisualsStore.getInstance().addListener(COMPONENT_ID, v => visualSettings = v)
    	SettingsStore.getInstance().addListener(COMPONENT_ID, v => settings = v)
    })

    onDestroy(() => {
    	VisualsStore.getInstance().removeListener(COMPONENT_ID)
    	SettingsStore.getInstance().removeListener(COMPONENT_ID)
    })
</script>

{#if settings !== undefined && visualSettings !== undefined}
    {#each toRender.form as form, i}
        <Accordion title={form.label} startOpen={true}>
            <div data-svelteform="-">
                {#each form.children as field}
                    {#if field.divider}
                        <div data-sveltedivider="-"></div>
                    {:else}
                        <ContentField
                                {settings}
                                {visualSettings}
                                toRender={field}
                        />
                    {/if}
                {/each}
            </div>
        </Accordion>
    {/each}
{/if}
