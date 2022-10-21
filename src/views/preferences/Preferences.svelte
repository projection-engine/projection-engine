<script>
    import {onMount} from "svelte";
    import Localization from "../../libs/Localization";
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

    const translate = (key) => Localization.SETTINGS.MAIN[key]

    onMount(() => {
        settings = structuredClone(SettingsStore.data)
        visuals = structuredClone(VisualsStore.data)
    })

    function apply() {
        SettingsStore.updateStore(settings)
        VisualsStore.updateStore(visuals)
        changed = false
        alert.pushAlert(translate("UPDATING_SETTINGS"), "info")
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
        <h3 style="margin: 0">{translate("SHORTCUTS")}</h3>
        <Shortcuts
                translate={translate}
                settings={settings}
                update={update}
        />

        <h3>{translate("CAMERA")}</h3>
        <CameraSettings/>

        <h3>{translate("GRID")}</h3>
        <GridSettings settings={settings}/>

        <h3>{translate("VIEWPORT")}</h3>
        <ViewportSettings
                translate={translate}
                settings={settings}
                update={update}
        />

        <h3>{translate("POST_PROCESSING")}</h3>
        <PostProcessing
                settings={visuals}
                update={update}
        />

        <h3>{translate("RENDERING")}</h3>
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