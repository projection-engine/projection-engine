<script>
    import Accordion from "../../shared/components/accordion/Accordion.svelte";
    import Checkbox from "../../shared/components/checkbox/Checkbox.svelte";
    import ColorPicker from "../../shared/components/color-picker/ColorPicker.svelte";
    import ShotcutField from "./ShotcutField.svelte";

    export let settings
    export let update
    export let translate
    function updateHotKey(key, objectKey, newValue){

    }
    let shortcuts
    $: {
        const vp = Object.entries(settings.viewportHotkeys).map(v => ([...v, (keys) => updateHotKey("viewportHotkeys", v[0], keys)]))
        const sc = Object.entries(settings.shaderEditorHotkeys).map(v => ([...v, (keys) => updateHotKey("shaderEditorHotkeys", v[0], keys)]))
        const cb = Object.entries(settings.contentBrowserHotkeys).map(v => ([...v, (keys) => updateHotKey("contentBrowserHotkeys", v[0], keys)]))


        shortcuts = {
            viewport: vp,
            shaderEditor: sc,
            contentBrowser: cb
        }
    }
</script>


<Accordion title={translate("SHORTCUTS")}>
   <div class="shortcuts">
       <fieldset>
           <legend>{translate("VIEWPORT")}</legend>
           {#each shortcuts.viewport as [key, value, update]}
               <ShotcutField shortcut={value} key={key} update={update}/>
           {/each}
       </fieldset>
       <fieldset>
           <legend>{translate("SHADER_EDITOR")}</legend>
           {#each shortcuts.shaderEditor as [key, value, update]}
               <ShotcutField shortcut={value} key={key} update={update}/>
           {/each}
       </fieldset>
       <fieldset>
           <legend>{translate("CONTENT_BROWSER")}</legend>
           {#each shortcuts.contentBrowser as [key, value, update]}
               <ShotcutField shortcut={value} key={key} update={update}/>
           {/each}
       </fieldset>
   </div>
</Accordion>

<Accordion title={translate("EDITOR")}>
    <Checkbox
            checked={settings.visible.metrics}
            handleCheck={() => {
            update("visible",  {...settings.visible, metrics: !settings.visible.metrics})
        }}
            label={translate("METRICS")}
    />
</Accordion>


<Accordion title={translate("BACKGROUND")}>
    <Checkbox
            checked={settings.background}
            handleCheck={() => {
            update("background",  !settings.background)
        }}
            label={translate("ENABLED")}
    />
    <ColorPicker
            label={translate("COLOR")}
            value={settings.backgroundColor.map(c => c*255)}
            submit={(color) => {
            update("backgroundColor", Object.values(color).map(c => c/255))
        }}
    />
</Accordion>


<Accordion title={translate("VIEWPORT")}>
    <Checkbox
            checked={settings.gridVisibility}
            handleCheck={() => {
            update("gridVisibility",  !settings.gridVisibility)
        }}
            label={translate("GRID_VISIBILITY")}
    />
    <Checkbox
            checked={settings.iconsVisibility}
            handleCheck={() => {
            update("iconsVisibility",  !settings.iconsVisibility)
        }}
            label={translate("ICON_VISIBILITY")}
    />
</Accordion>


<style>
    legend{
        font-size: .85rem;
        font-weight: 550;
    }
    fieldset{
        padding-top: 10px;
    }
    .shortcuts{
        max-height: 50vh;
        overflow-y: auto;
        display: flex;
        gap: 8px;
        justify-content: flex-start;
        flex-direction: column;
    }
</style>