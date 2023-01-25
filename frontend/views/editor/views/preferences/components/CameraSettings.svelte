<script>
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import CameraTracker from "../../../../../../engine-tools/lib/CameraTracker";
    import SettingsStore from "../../../stores/SettingsStore";
    import Range from "../../../../../components/range/Range.svelte";
    import Layout from "../../inspector/components/engine/dynamic-form/Layout.svelte";
    import CAMERA_PROPS from "../../../../../../engine-core/static/component-props/CAMERA_PROPS";
    import Accordion from "../../../../../components/accordion/Accordion.svelte";

    export let settings
    const updateCamera = (key, value, full) => {

        if (full)
            SettingsStore.updateStore({...settings, camera: {...settings.camera, [key]: value}})
        if (CameraTracker[key] !== undefined)
            CameraTracker[key] = value
    }
    $: cameraSettings = {...settings.camera, props: CAMERA_PROPS}
</script>


<Accordion title={LOCALIZATION_EN.MOVEMENT_SPEED} startOpen={true}>
    <div data-svelteform="-">
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

        <Range
                incrementPercentage={.001}
                minValue={0}
                maxValue={10}
                label={LOCALIZATION_EN.SMOOTHING}
                onFinish={(v) => updateCamera("smoothing", 1/v, true)}
                value={cameraSettings.smoothing}
                handleChange={v => updateCamera("smoothing", 1/v)}
        />
    </div>
</Accordion>


<Layout
        component={cameraSettings}
        submit={updateCamera}
/>