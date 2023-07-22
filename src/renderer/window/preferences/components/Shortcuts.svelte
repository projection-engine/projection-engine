<script>
    import ShotcutField from "./ShotcutField.svelte"
    import SETTINGS from "../../editor/static/SETTINGS"
    import SettingsStore from "../../shared/stores/SettingsStore"
    import PropertyHeader from "../../shared/components/PropertyHeader.svelte"
    import LocalizationEN from "../../../../shared/enums/LocalizationEN"
    import {onDestroy, onMount} from "svelte"

    const COMPONENT_ID = crypto.randomUUID()

    function update(key, value) {
    	SettingsStore.updateStore({[key]: value})
    }

    function updateHotKey(key, objectKey, newValue) {
    	const newData = {...SettingsStore.getData()[key], [objectKey]: newValue}
    	update(key, newData)
    }

    let shortcuts = {viewport: [], shaderEditor: [], contentBrowser: []}
    let allShortcuts

    onMount(() => {
    	SettingsStore.getInstance().addListener(COMPONENT_ID, data => {
    		const vp = Object.entries(data.viewportHotkeys).map(v => ([...v, "viewportHotkeys", (keys) => updateHotKey("viewportHotkeys", v[0], keys)]))
    		const sc = Object.entries(data.shaderEditorHotkeys).map(v => ([...v, "shaderEditorHotkeys", (keys) => updateHotKey("shaderEditorHotkeys", v[0], keys)]))
    		const cb = Object.entries(data.contentBrowserHotkeys).map(v => ([...v, "contentBrowserHotkeys", (keys) => updateHotKey("contentBrowserHotkeys", v[0], keys)]))
    		allShortcuts = [
    			...Object.values(data.viewportHotkeys),
    			...Object.values(data.shaderEditorHotkeys),
    			...Object.values(data.contentBrowserHotkeys)
    		]
    		shortcuts = {
    			viewport: vp,
    			shaderEditor: sc,
    			contentBrowser: cb
    		}
    	})
    })
    onDestroy(() => SettingsStore.getInstance().removeListener(COMPONENT_ID))
</script>

<PropertyHeader title={LocalizationEN.SHORTCUTS}/>
<fieldset>
    <legend>{LocalizationEN.VIEWPORT}</legend>
    <div class="shortcuts">
        {#each shortcuts.viewport as [key, value, wrapperKey, update]}
            <ShotcutField all={allShortcuts} wrapperKey={wrapperKey} shortcut={value} key={key} update={update}/>
        {/each}
    </div>
</fieldset>
<fieldset>
    <legend>{LocalizationEN.SHADER_EDITOR}</legend>
    <div class="shortcuts">
        {#each shortcuts.shaderEditor as [key, value, wrapperKey, update]}
            <ShotcutField all={allShortcuts} wrapperKey={wrapperKey} shortcut={value} key={key} update={update}/>
        {/each}
    </div>
</fieldset>
<fieldset>
    <legend>{LocalizationEN.CONTENT_BROWSER}</legend>
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
    {LocalizationEN.RESET}
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