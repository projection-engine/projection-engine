<script>
    import {onDestroy} from "svelte";
    import LOCALIZATION_EN from "../../static/LOCALIZATION_EN";
    import Shortcuts from "./components/Shortcuts.svelte";
    import SettingsStore from "../../stores/SettingsStore";
    import VisualsStore from "../../stores/VisualsStore";
    import CameraSettings from "./components/CameraSettings.svelte";
    import GlobalSettings from "./components/GlobalSettings.svelte";
    import DefaultPreferences from "./components/content/ContentWrapper.svelte";
    import Accordion from "../../../../components/accordion/Accordion.svelte";

    const {ipcRenderer} = window.require("electron")
    let tab = 0

    let settings
    let visuals

    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    const unsubscribeVisuals = VisualsStore.getStore(v => visuals = v)

    onDestroy(() => {
        unsubscribeSettings()
        unsubscribeVisuals()
    })
</script>

<div class="wrapper">
    <div class="content">
        <Accordion title={LOCALIZATION_EN.GLOBAL} startOpen={true}>
            <GlobalSettings/>
        </Accordion>

        <Accordion title={LOCALIZATION_EN.SHORTCUTS}>
            <Shortcuts settings={settings}/>
        </Accordion>

        <DefaultPreferences {settings} {visuals}/>

        <Accordion title={LOCALIZATION_EN.CAMERA}>
            <CameraSettings settings={settings}/>
        </Accordion>
    </div>
</div>

<style>
    .content {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 6px;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        padding-bottom: 50%;
    }

    strong {
        font-weight: 500;
        padding: 4px 8px;
        font-size: .9rem;
        text-align: left;
        width: 100%;
    }

    .wrapper {
        display: flex;
        align-items: flex-start;
        gap: 3px;


        position: relative;
        margin: auto;

        padding: 3px;
        width: 100%;
        max-width: clamp(500px, 50vw, 1000px);
        height: 100%;

        overflow-x: hidden;
        overflow-y: auto;

    }


</style>