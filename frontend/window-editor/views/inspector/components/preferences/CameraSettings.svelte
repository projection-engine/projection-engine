<script>
    import LOCALIZATION_EN from "../../../../../shared/static/LOCALIZATION_EN";
    import CameraTracker from "../../../../../../engine-tools/lib/CameraTracker";
    import SettingsStore from "../../../../../shared/stores/SettingsStore";
    import Layout from "../engine/dynamic-form/Layout.svelte";
    import CAMERA_PROPS from "../../../../../../engine-core/static/component-props/CAMERA_PROPS";
    import Builder from "../../../../../window-preferences/components/content/ContentField.svelte";
    import {CAMERA_SETTINGS} from "../../../../../window-preferences/static/PREFERENCES";

    export let settings
    const updateCamera = (key, value, full) => {

        if (full)
            SettingsStore.updateStore({...settings, camera: {...settings.camera, [key]: value}})
        if (CameraTracker[key] !== undefined)
            CameraTracker[key] = value
    }
    $: cameraSettings = {...settings.camera, props: CAMERA_PROPS}
</script>

<fieldset>
    <legend>{LOCALIZATION_EN.MOVEMENT}</legend>
    <div data-svelteform="-">
        {#each CAMERA_SETTINGS as toRender}
            <Builder toRender={toRender} settings={settings}/>
        {/each}
    </div>
</fieldset>

<Layout
        component={cameraSettings}
        submit={updateCamera}
/>