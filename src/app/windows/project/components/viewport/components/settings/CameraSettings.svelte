<script>
    import Range from "../../../../../../components/range/Range.svelte";
    import Localization from "../../../../../../libs/Localization";
    import RendererStoreController from "../../../../stores/RendererStoreController";
    import {onDestroy} from "svelte";
    import CameraAPI from "../../../../libs/engine/production/libs/apis/CameraAPI";
    import CameraTracker from "../../../../libs/engine/editor/libs/CameraTracker";

    const toDeg = 180 / Math.PI, toRad = Math.PI / 180
    let settings = {}
    const unsubscribeSettings = RendererStoreController.getSettings(v => settings = v)
    onDestroy(() => unsubscribeSettings())
    let state = {
        zFar: settings.zFar,
        zNear: settings.zNear,
        fov: settings.fov * toDeg,
        radius: CameraTracker.radius
    }

    const translate = (key) => Localization.PROJECT.VIEWPORT[key]

</script>

<div>

    <Range
            minLabelWidth={"30px"}
            label={translate("FAR")}
            minValue={state.zNear + 1}
            onFinish={(v) => {
            settings.zFar = v
            state.zFar = v
                CameraAPI.metadata.zFar = v
            CameraAPI.updateProjection()
        }}
            value={state.zFar}
            handleChange={v => state.zFar = v}
    />
    <Range
            minLabelWidth={"30px"}
            label={translate("NEAR")}
            maxValue={state.zFar - 1}
            onFinish={(v) => {
                settings.zNear = v
                state.zNear = v
                    CameraAPI.metadata.zNear = v
                    CameraAPI.updateProjection()
            }}
            value={state.zNear}
            handleChange={v => state.zNear = v}
    />


    <Range
            minLabelWidth={"30px"}
            label={translate("FOV")}
            minValue={10}
            maxValue={110}
            disabled={settings.ortho}

            onFinish={(v) => {
            settings.fov = v * toRad
            state.fov = v
                CameraAPI.metadata.fov = v * toRad
                CameraAPI.updateProjection()
        }}
            value={state.fov}
            handleChange={v => state.fov = v}
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
                state.radius = v
                CameraTracker.radius = v
                CameraTracker.update(true)
            }}
    />
</div>