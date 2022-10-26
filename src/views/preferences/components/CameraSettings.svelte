<script>
    import Range from "shared-resources/frontend/components/range/Range.svelte";
    import Localization from "../../../templates/LOCALIZATION_EN";
    import CameraAPI from "../../../../public/engine/api/CameraAPI";
    import CameraTracker from "../../../../public/engine/editor-environment/libs/CameraTracker";
    import SettingsStore from "../../../stores/SettingsStore";
    import {onDestroy} from "svelte";

    let settings
    const unsubscribe = SettingsStore.getStore(v => settings = v)
    const toDeg = 180 / Math.PI, toRad = Math.PI / 180

    let state = {
        zFar: settings.zFar,
        zNear: settings.zNear,
        fov: settings.fov * toDeg,
        smoothing: settings.camera.smoothing,
        rotationSmoothing: settings.camera.rotationSmoothing,
        ortho: settings.ortho,
        movementSpeed: settings.camera.movementSpeed,
        turnSpeed: settings.camera.turnSpeed
    }

    const updateCamera = (key, value, full) => {
        if (full) {
            SettingsStore.updateStore({...settings, camera: {...settings.camera, [key]: value}})
            state = {...state, [key]: value}
        }
        CameraTracker[key] = value
    }
    onDestroy(() => unsubscribe())
</script>


<fieldset>
    <legend>{Localization.VIEW}</legend>
    <div class="content">
        <Range
                minLabelWidth={"30px"}
                label={Localization.FAR}
                variant="embedded"
                incrementPercentage={1}
                onFinish={(v) => {
                SettingsStore.updateStore({...settings, zFar: v})

                state.zFar = v
                CameraAPI.zFar = v
                CameraAPI.updateProjection()
            }}
                value={state.zFar}
                handleChange={v => {
                CameraAPI.zFar = v
                CameraAPI.updateProjection()
            }}
        />
        <Range
                minLabelWidth={"30px"}
                variant="embedded"
                label={Localization.NEAR}
                onFinish={(v) => {
               SettingsStore.updateStore({...settings, zNear: v})

                state.zNear = v
                CameraAPI.zNear = v
                CameraAPI.updateProjection()
            }}
                value={state.zNear}
                handleChange={v => {
                state.zNear = v
                CameraAPI.zNear = v
                CameraAPI.updateProjection()
            }}
        />
        <Range
                variant="embedded"
                minLabelWidth={"30px"}
                label={Localization.FOV}
                minValue={10}
                maxValue={150}
                disabled={state.ortho}

                onFinish={(v) => {
                const value = v * toRad
                SettingsStore.updateStore({...settings, fov: value})
                state.fov = value
                CameraAPI.fov = value
                CameraAPI.updateProjection()
            }}
                value={state.fov}
                handleChange={v => {
                CameraAPI.fov = v * toRad
                CameraAPI.updateProjection()
            }}
        />
    </div>
</fieldset>

<fieldset>
    <legend>{Localization.CAMERA_BEHAVIOUR}</legend>
    <div class="content">
        <Range
                variant="embedded"
                precision={4}
                incrementPercentage={.001}
                label={Localization.TRANSLATION}
                onFinish={(v) => updateCamera("movementSpeed", v, true)}
                value={state.movementSpeed}
                handleChange={v => updateCamera("movementSpeed", v)}
        />

        <Range
                variant="embedded"
                precision={4}
                incrementPercentage={.001}
                label={Localization.ROTATION}
                onFinish={(v) => updateCamera("turnSpeed", v, true)}
                value={state.turnSpeed}
                handleChange={v => updateCamera("turnSpeed", v)}
        />

    </div>
</fieldset>


<fieldset>
    <legend>{Localization.SMOOTHING}</legend>
    <div class="content">
        <Range
                variant="embedded"
                precision={3}
                minValue={.0001}
                incrementPercentage={.001}
                label={Localization.TRANSLATION}
                onFinish={(v) => updateCamera("smoothing", v, true)}
                value={state.smoothing}
                handleChange={v => updateCamera("smoothing", v)}
        />
        <Range
                variant="embedded"
                precision={3}
                minValue={.0001}
                incrementPercentage={.001}
                label={Localization.ROTATION}
                onFinish={(v) => updateCamera("rotationSmoothing", v, true)}
                value={state.rotationSmoothing}
                handleChange={v => updateCamera("rotationSmoothing", v)}
        />
    </div>
</fieldset>


<style>
    legend {
        font-size: .8rem;
    }

    .content {
        padding-left: 25%;
        display: grid;
        gap: 4px;
    }
</style>