<script>
    import Range from "../../../../../shared/components/range/Range.svelte";
    import Localization from "../../../../../shared/libs/Localization";
    import CameraAPI from "../../../../../../public/engine/production/apis/CameraAPI";
    import CameraTracker from "../../../../../../public/engine/editor/libs/CameraTracker";
    import SettingsStore from "../../../../stores/SettingsStore";
    import Checkbox from "../../../../../shared/components/checkbox/Checkbox.svelte";

    const toDeg = 180 / Math.PI, toRad = Math.PI / 180

    let state = {
        zFar: SettingsStore.data.zFar,
        zNear: SettingsStore.data.zNear,
        fov: SettingsStore.data.fov * toDeg,
        radius: CameraTracker.radius,

        ortho: SettingsStore.data.ortho,
        animated: SettingsStore.data.camera.animated,
        movementSpeed: SettingsStore.data.camera.movementSpeed,
        scrollSpeed: SettingsStore.data.camera.scrollSpeed,

        turnSpeed: SettingsStore.data.camera.turnSpeed
    }

    const translate = (key) => Localization.PROJECT.VIEWPORT[key]
    const updateCamera = (key, value, full) => {
        if (full) {
            SettingsStore.updateStore({...SettingsStore.data, camera: {...SettingsStore.data.camera, [key]: value}})
            state = {...state, [key]: value}
        }
        CameraTracker[key] = value
    }
</script>

<fieldset>
    <legend>{translate("VIEW")}</legend>
    <Range
            minLabelWidth={"30px"}
            label={translate("FAR")}
            variant="embedded"
            incrementPercentage={1}
            onFinish={(v) => {
                SettingsStore.updateStore({...SettingsStore.data, zFar: v})

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
            label={translate("NEAR")}
            onFinish={(v) => {
               SettingsStore.updateStore({...SettingsStore.data, zNear: v})

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
            label={translate("FOV")}
            minValue={10}
            maxValue={150}
            disabled={state.ortho}

            onFinish={(v) => {
                const value = v * toRad
                SettingsStore.updateStore({...SettingsStore.data, fov: value})
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
    <Range
            variant="embedded"
            label={translate("ZOOM")}
            onFinish={(v) => {
                SettingsStore.updateStore({...SettingsStore.data, radius: v})

                state.radius = v
                CameraTracker.radius = v
                CameraTracker.update(true)
            }}
            hideValue={true}
            value={state.radius}
            handleChange={v => {
                CameraTracker.radius = v
                CameraTracker.update(true)
            }}
    />
</fieldset>

<fieldset>
    <legend>{translate("CAMERA_BEHAVIOUR")}</legend>
    <Range
            variant="embedded"
            precision={4}
            incrementPercentage={.001}
            label={translate("MOVEMENT_SPEED")}
            onFinish={(v) => updateCamera("movementSpeed", v, true)}
            value={state.movementSpeed}
            handleChange={v => updateCamera("movementSpeed", v)}
    />
    <Range
            variant="embedded"
            label={translate("SCROLL_SPEED")}
            onFinish={(v) => updateCamera("scrollSpeed", v, true)}
            value={state.scrollSpeed}
            handleChange={v => updateCamera("scrollSpeed", v)}
    />
    <Range
            variant="embedded"
            precision={4}
            incrementPercentage={.001}
            label={translate("TURN_SPEED")}
            onFinish={(v) => updateCamera("turnSpeed", v, true)}
            value={state.turnSpeed}
            handleChange={v => updateCamera("turnSpeed", v)}
    />
    <Checkbox
            checked={state.animated}
            handleCheck={() => updateCamera("animated", !state.animated, true)}
            label={translate("CAM_ANIM")}
    />
</fieldset>


<style>
    fieldset {
        padding: 4px;
        margin-top: 4px;
    }
</style>