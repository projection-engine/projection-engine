<script>
    import {onDestroy, onMount} from "svelte";
    import Localization from "../../templates/LOCALIZATION_EN";
    import PostProcessing from "./components/PostProcessing.svelte";
    import Rendering from "./components/Rendering.svelte";
    import ViewportSettings from "./components/ViewportSettings.svelte";
    import Shortcuts from "./components/Shortcuts.svelte";
    import SettingsStore from "../../stores/SettingsStore";
    import VisualsStore from "../../stores/VisualsStore";
    import CameraSettings from "./components/CameraSettings.svelte";
    import GridSettings from "./components/GridSettings.svelte";

    let settings
    let visuals

    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    const unsubscribeVisuals = VisualsStore.getStore(v => visuals = v)

    let timeout
    let tab = 0

    onDestroy(() => {
        unsubscribeSettings()
        unsubscribeVisuals()
    })
</script>

<div class="wrapper">
    <h3 style="margin: 0">{Localization.SHORTCUTS}</h3>
    <Shortcuts settings={settings}/>

    <h3>{Localization.CAMERA}</h3>
    <CameraSettings/>

    <h3>{Localization.GRID}</h3>
    <GridSettings settings={settings}/>

    <h3>{Localization.VIEWPORT}</h3>
    <ViewportSettings settings={settings}/>

    <h3>{Localization.POST_PROCESSING}</h3>
    <PostProcessing visualSettings={visuals}/>

    <h3>{Localization.RENDERING}</h3>
    <Rendering visualSettings={visuals}/>
</div>

<style>

    h3 {
        font-weight: 500;
        margin: 32px 0 0;
    }

    .wrapper {
        display: flex;
        justify-content: flex-start;
        flex-flow: column;
        gap: 6px;


        position: relative;
        margin: auto;

        padding: 32px 16px 100px;

        width: 100%;
        max-width: clamp(500px, 50vw, 1000px);
        height: 100%;

        overflow-x: hidden;
        overflow-y: auto;

    }


</style>