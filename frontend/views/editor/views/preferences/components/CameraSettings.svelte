<script>
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import CameraTracker from "../../../../../../engine-tools/lib/CameraTracker";
    import SettingsStore from "../../../stores/SettingsStore";
    import Range from "../../../../../components/range/Range.svelte";
    import Layout from "../../inspector/components/engine/dynamic-form/Layout.svelte";
    import CAMERA_PROPS from "../../../../../../engine-core/static/component-props/CAMERA_PROPS";

    export let settings
    const updateCamera = (key, value, full) => {

        if (full)
            SettingsStore.updateStore({...settings, camera: {...settings.camera, [key]: value}})
        if(CameraTracker[key] !== undefined)
            CameraTracker[key] = value
    }
    $: cameraSettings = {...settings.camera, props: CAMERA_PROPS}
</script>


<fieldset>
    <legend>{LOCALIZATION_EN.MOVEMENT_SPEED}</legend>
    <div data-form="-">
        <Range
                incrementPercentage={.1}
                minValue={.01}
                label={LOCALIZATION_EN.SCREEN_GRABBING_SPEED}
                onFinish={(v) => updateCamera("screenSpaceMovementSpeed", v, true)}
                value={cameraSettings.screenSpaceMovementSpeed}
                handleChange={v => updateCamera("screenSpaceMovementSpeed", v)}
        />

        <Range
                incrementPercentage={.1}
                minValue={.01}
                label={LOCALIZATION_EN.TRANSLATION}
                onFinish={(v) => updateCamera("movementSpeed", v, true)}
                value={cameraSettings.movementSpeed}
                handleChange={v => updateCamera("movementSpeed", v)}
        />

        <Range

                incrementPercentage={.001}
                minValue={.01}
                label={LOCALIZATION_EN.ROTATION}
                onFinish={(v) => updateCamera("turnSpeed", v, true)}
                value={cameraSettings.turnSpeed}
                handleChange={v => updateCamera("turnSpeed", v)}
        />

    </div>
</fieldset>


<fieldset>
    <legend>{LOCALIZATION_EN.SMOOTHING_FALLOFF}</legend>
    <div data-form="-">
        <Range
                minValue={.0001}
                incrementPercentage={.001}
                label={LOCALIZATION_EN.TRANSLATION}
                onFinish={(v) => updateCamera("smoothing", v, true)}
                value={cameraSettings.smoothing}
                handleChange={v => updateCamera("smoothing", v)}
        />
        <Range
                minValue={.0001}
                incrementPercentage={.001}
                label={LOCALIZATION_EN.ROTATION}
                onFinish={(v) => updateCamera("rotationSmoothing", v, true)}
                value={cameraSettings.rotationSmoothing}
                handleChange={v => updateCamera("rotationSmoothing", v)}
        />
    </div>
</fieldset>


<Layout
        component={cameraSettings}
        submit={updateCamera}
/>