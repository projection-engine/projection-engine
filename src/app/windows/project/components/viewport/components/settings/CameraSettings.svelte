<script>
    import Range from "../../../../../../components/range/Range.svelte";
    import EnglishLocalization from "../../../../../../static/EnglishLocalization";
    import StoreController from "../../../../stores/StoreController";
    import {onDestroy} from "svelte";

    const toDeg = 180 / Math.PI, toRad = Math.PI / 180
    let settings = {}
    const unsubscribeSettings = StoreController.getSettings(v => settings=v)
    onDestroy(() => unsubscribeSettings())
    let state = {
        zFar: settings.zFar,
        zNear: settings.zNear,
        fov: settings.fov * toDeg,
        radius: window.renderer.camera.radius
    }

    const translate = (key) => EnglishLocalization.PROJECT.VIEWPORT[key]

</script>

<div>

    <Range
            minLabelWidth={"30px"}
            label={translate("FAR")}
            minValue={state.zNear + 1}
            onFinish={(v) => {
            settings.zFar = v
            state.zFar = v
            window.renderer.camera.zFar = v
            window.renderer.camera.updateProjection()
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
                window.renderer.camera.zNear = v
                window.renderer.camera.updateProjection()
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
            window.renderer.camera.fov = v * toRad
            window.renderer.camera.updateProjection()
        }}
            value={state.fov}
            handleChange={v => state.fov = v}
    />
    <Range
            label={translate("ZOOM")}
            onFinish={(v) => {
            settings.radius = v
            state.radius = v
            window.renderer.camera.radius = v
            window.renderer.camera.updateViewMatrix()
        }}
            hideValue={true}
            value={state.radius}
            handleChange={v => {
            state.radius = v
            window.renderer.camera.radius = v
            window.renderer.camera.updateViewMatrix()
        }}
    />
</div>