<script>
    import Range from "shared-resources/frontend/components/range/Range.svelte";
    import Localization from "../../../templates/LOCALIZATION_EN";
    import CameraAPI from "../../../../../engine-core/lib/utils/CameraAPI";
    import CameraTracker from "../../../../../engine-tools/lib/CameraTracker";
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
    <div data-form="-">
        <Range
                minLabelWidth={"30px"}
                label={Localization.FAR}
                variant="embedded"
                incrementPercentage={1}
                onFinish={(v) => {
                    SettingsStore.updateStore({...settings, zFar: v})
                    CameraAPI.zFar = v
                    CameraAPI.updateProjection()
                }}
                value={settings.zFar}
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

                    CameraAPI.zNear = v
                    CameraAPI.updateProjection()
                }}
                value={settings.zNear}
                handleChange={v => {
                state.zNear = v
                CameraAPI.zNear = v
                CameraAPI.updateProjection()
            }}
        />
        <Range
                variant="embedded"
                label={Localization.FOV}
                minValue={10}
                maxValue={150}
                disabled={state.ortho}
                onFinish={v => {
                    const value = v / toDeg
                    SettingsStore.updateStore({...settings, fov: value})
                    CameraAPI.fov = value
                    CameraAPI.updateProjection()
                }}
                value={settings.fov * toDeg}
                handleChange={v => {
                    CameraAPI.fov = v / toDeg
                    CameraAPI.updateProjection()
                }}
        />
    </div>
</fieldset>

<fieldset>
    <legend>{Localization.MOVEMENT_SPEED}</legend>
    <div data-form="-">
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
    <div data-form="-">
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


