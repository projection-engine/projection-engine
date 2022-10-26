<script>
    import {onMount} from "svelte";
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
    let timeout
    let tab = 0
    let changed = false


    onMount(() => {
        settings = structuredClone(SettingsStore.data)
        visuals = structuredClone(VisualsStore.data)
    })

    function apply() {
        SettingsStore.updateStore(settings)
        VisualsStore.updateStore(visuals)
        changed = false
        alert.pushAlert(Localization.UPDATING_SETTINGS, "info")
    }

    function update(key, value) {
        changed = true
        settings = {...settings, [key]: value}
        clearTimeout(timeout)
        timeout = setTimeout(_ => apply(), 250)
    }
</script>

<div class="wrapper">
    {#if settings != null}
        <h3 style="margin: 0">{Localization.SHORTCUTS}</h3>
        <Shortcuts
                settings={settings}
                update={update}
        />

        <h3>{Localization.CAMERA}</h3>
        <CameraSettings/>

        <h3>{Localization.GRID}</h3>
        <GridSettings settings={settings}/>

        <h3>{Localization.VIEWPORT}</h3>
        <ViewportSettings
                settings={settings}
                update={update}
        />

        <h3>{Localization.POST_PROCESSING}</h3>
        <PostProcessing
                settings={visuals}
                update={update}
        />

        <h3>{Localization.RENDERING}</h3>
        <Rendering
                settings={visuals}
                update={(key, value) => {
                    changed = true
                    visuals = {...visuals, [key]: value}
                    clearTimeout(timeout)
                    timeout = setTimeout(_ => apply(), 250)
                }}
        />


    {/if}
</div>

<style>

    h3 {
        font-weight: 500;
        margin: 32px 0 0;
    }

    .wrapper {
        display: grid;
        align-content: flex-start;
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