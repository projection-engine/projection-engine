<script>
    import Range from "../../../../../../components/range/Range.svelte";
    import Localization from "../../../../../../libs/Localization";
    import {onDestroy} from "svelte";
    import CameraAPI from "../../../../libs/engine/production/libs/CameraAPI";
    import CameraTracker from "../../../../libs/engine/editor/libs/CameraTracker";
    import SettingsStore from "../../../../stores/SettingsStore";
    import Icon from "../../../../../../components/icon/Icon.svelte";

    const toDeg = 180 / Math.PI, toRad = Math.PI / 180
    let settings = {}
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    onDestroy(() => unsubscribeSettings())
    let state = {
        zFar: settings.zFar,
        zNear: settings.zNear,
        fov: settings.fov * toDeg,
        radius: CameraTracker.radius,

        movementSpeed: CameraTracker.movementSpeed,
        scrollSpeed: CameraTracker.scrollSpeed,
        scrollDelay: CameraTracker.scrollDelay,
        turnSpeed: CameraTracker.turnSpeed
    }

    const translate = (key) => Localization.PROJECT.VIEWPORT[key]
    const updateCamera = (key, value, full) => {
        if (full) {
            SettingsStore.updateStore({...settings, camera: {...settings.camera, [key]: value}})
            state = {...state, [key]: value}
        }
        CameraTracker[key] = value
    }
</script>

<fieldset class="wrapper">
    <legend>{translate("VIEW")}</legend>
    <Range
            minLabelWidth={"30px"}
            label={translate("FAR")}
            incrementPercentage={1}
            onFinish={(v) => {
                settings.zFar = v
                state.zFar = v
                CameraAPI.metadata.zFar = v
                CameraAPI.updateProjection()
            }}
            value={state.zFar}
            handleChange={v => {
                CameraAPI.metadata.zFar = v
                CameraAPI.updateProjection()
            }}
    />
    <Range
            minLabelWidth={"30px"}
            label={translate("NEAR")}
            onFinish={(v) => {
                settings.zNear = v

                state.zNear = v
                CameraAPI.metadata.zNear = v
                CameraAPI.updateProjection()
            }}
            value={state.zNear}
            handleChange={v => {
                state.zNear = v
                CameraAPI.metadata.zNear = v
                CameraAPI.updateProjection()
            }}
    />


    <Range
            minLabelWidth={"30px"}
            label={translate("FOV")}
            minValue={10}
            maxValue={150}
            disabled={settings.ortho}

            onFinish={(v) => {
                const value = v * toRad
                settings.fov = value
                state.fov =value
                CameraAPI.metadata.fov =value
                CameraAPI.updateProjection()
            }}
            value={state.fov}
            handleChange={v => {
                CameraAPI.metadata.fov = v * toRad
                CameraAPI.updateProjection()
            }}
    />
    <Range
            label={translate("ZOOM")}
            onFinish={(v) => {
                settings.radius = v
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

<fieldset class="wrapper">
    <legend>{translate("CAMERA_BEHAVIOUR")}</legend>
    <Range
            precision={4}
            incrementPercentage={.001}
            label={translate("MOVEMENT_SPEED")}
            onFinish={(v) => updateCamera("movementSpeed", v, true)}
            value={state.movementSpeed}
            handleChange={v => updateCamera("movementSpeed", v)}
    />
    <Range
            label={translate("SCROLL_SPEED")}
            onFinish={(v) => updateCamera("scrollSpeed", v, true)}
            value={state.scrollSpeed}
            handleChange={v => updateCamera("scrollSpeed", v)}
    />
    <Range
            precision={4}
            incrementPercentage={.001}
            label={translate("TURN_SPEED")}
            onFinish={(v) => updateCamera("turnSpeed", v, true)}
            value={state.turnSpeed}
            handleChange={v => updateCamera("turnSpeed", v)}
    />
    <button on:click={() => updateCamera("animated", !settings.camera.animated, true)}>
        {#if settings.camera.animated}
            <Icon>check</Icon>
        {/if}
        {translate("CAM_ANIM")}
    </button>
</fieldset>


<style>
    .wrapper {
        padding: 2px;
    }
</style>