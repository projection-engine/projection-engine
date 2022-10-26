<script>
    import Accordion from "../../../components/accordion/Accordion.svelte";
    import ShotcutField from "./ShotcutField.svelte";
    import SETTINGS from "../../../data/SETTINGS";
    import Localization from "../../../templates/Localization";

    export let settings
    export let update

    function updateHotKey(key, objectKey, newValue) {
        const newData = {...settings[key], [objectKey]: newValue}
        update(key, newData)
    }

    let shortcuts
    let allShortcuts
    $: {
        const vp = Object.entries(settings.viewportHotkeys).map(v => ([...v, "viewportHotkeys", (keys) => updateHotKey("viewportHotkeys", v[0], keys)]))
        const sc = Object.entries(settings.shaderEditorHotkeys).map(v => ([...v, "shaderEditorHotkeys", (keys) => updateHotKey("shaderEditorHotkeys", v[0], keys)]))
        const cb = Object.entries(settings.contentBrowserHotkeys).map(v => ([...v, "contentBrowserHotkeys", (keys) => updateHotKey("contentBrowserHotkeys", v[0], keys)]))
        allShortcuts = [
            ...Object.values(settings.viewportHotkeys),
            ...Object.values(settings.shaderEditorHotkeys),
            ...Object.values(settings.contentBrowserHotkeys)
        ]

        shortcuts = {
            viewport: vp,
            shaderEditor: sc,
            contentBrowser: cb
        }
    }
</script>


<Accordion title={Localization.VIEWPORT}>
    <div class="shortcuts">
        {#each shortcuts.viewport as [key, value, wrapperKey, update]}
            <ShotcutField all={allShortcuts} wrapperKey={wrapperKey} shortcut={value} key={key} update={update}/>
        {/each}
    </div>
</Accordion>
<Accordion title={Localization.SHADER_EDITOR}>
    <div class="shortcuts">
        {#each shortcuts.shaderEditor as [key, value, wrapperKey, update]}
            <ShotcutField all={allShortcuts} wrapperKey={wrapperKey} shortcut={value} key={key} update={update}/>
        {/each}
    </div>
</Accordion>
<Accordion title={Localization.CONTENT_BROWSER}>
    <div class="shortcuts">
        {#each shortcuts.contentBrowser as [key, value, wrapperKey, update]}
            <ShotcutField all={allShortcuts} wrapperKey={wrapperKey} shortcut={value} key={key} update={update}/>
        {/each}
    </div>
</Accordion>
<button
        on:click={() => {
            update("viewportHotkeys", SETTINGS.viewportHotkeys)
            update("contentBrowserHotkeys", SETTINGS.contentBrowserHotkeys)
            update("shaderEditorHotkeys", SETTINGS.shaderEditorHotkeys)
        }}
>
    {Localization.RESET}
</button>
<style>
    legend {
        font-size: .85rem;
        font-weight: 500;
    }

    fieldset {
        padding-top: 10px;
    }

    .shortcuts {
        max-height: 50vh;
        overflow-y: auto;
        display: flex;
        gap: 8px;
        justify-content: flex-start;
        flex-direction: column;
    }
</style>