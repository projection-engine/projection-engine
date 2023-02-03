<script>
    import Accordion from "../../shared/components/accordion/Accordion.svelte";
    import ShotcutField from "./ShotcutField.svelte";
    import SETTINGS from "../../window-editor/static/SETTINGS";
    import LOCALIZATION_EN from "../../shared/static/LOCALIZATION_EN";
    import SettingsStore from "../../shared/stores/SettingsStore";

    export let settings

    function update(key, value) {
        SettingsStore.updateStore({...settings, [key]: value})
    }

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

<h3>{LOCALIZATION_EN.SHORTCUTS}</h3>
<fieldset >
    <legend>{LOCALIZATION_EN.VIEWPORT}</legend>
    <div class="shortcuts">
        {#each shortcuts.viewport as [key, value, wrapperKey, update]}
            <ShotcutField all={allShortcuts} wrapperKey={wrapperKey} shortcut={value} key={key} update={update}/>
        {/each}
    </div>
</fieldset>
<fieldset>
    <legend>{LOCALIZATION_EN.SHADER_EDITOR}</legend>
    <div class="shortcuts">
        {#each shortcuts.shaderEditor as [key, value, wrapperKey, update]}
            <ShotcutField all={allShortcuts} wrapperKey={wrapperKey} shortcut={value} key={key} update={update}/>
        {/each}
    </div>
</fieldset>
<fieldset>
    <legend>{LOCALIZATION_EN.CONTENT_BROWSER}</legend>
    <div class="shortcuts">
        {#each shortcuts.contentBrowser as [key, value, wrapperKey, update]}
            <ShotcutField all={allShortcuts} wrapperKey={wrapperKey} shortcut={value} key={key} update={update}/>
        {/each}
    </div>
</fieldset>

<button data-sveltebuttondefault="-"
        on:click={() => {
            update("viewportHotkeys", SETTINGS.viewportHotkeys)
            update("contentBrowserHotkeys", SETTINGS.contentBrowserHotkeys)
            update("shaderEditorHotkeys", SETTINGS.shaderEditorHotkeys)
        }}
>
    {LOCALIZATION_EN.RESET}
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

    h3 {
        padding: 0 8px;
        margin: 8px 0;
        font-weight: 550;
    }
</style>