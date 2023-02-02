<script>
    import {onDestroy} from "svelte";
    import LOCALIZATION_EN from "../../../../../shared/static/LOCALIZATION_EN";
    import Shortcuts from "../../../../../window-preferences/components/Shortcuts.svelte";
    import SettingsStore from "../../../../stores/SettingsStore";
    import VisualsStore from "../../../../stores/VisualsStore";
    import CameraSettings from "./CameraSettings.svelte";
    import GlobalSettings from "../../../../../window-preferences/components/GlobalSettings.svelte";
    import DefaultPreferences from "../../../../../window-preferences/components/content/ContentWrapper.svelte";
    import Accordion from "../../../../../shared/components/accordion/Accordion.svelte";
    import Electron from "../../../../../shared/lib/Electron";

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

<!--        <DefaultPreferences {settings} {visuals}/>-->

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