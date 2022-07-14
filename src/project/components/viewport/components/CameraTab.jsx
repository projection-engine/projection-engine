import useDirectState from "../../../../components/hooks/useDirectState"
import React, {useContext} from "react"
import SettingsProvider from "../../../context/SettingsProvider"
import styles from "../../component/styles/Forms.module.css"
import Range from "../../../../components/range/Range"

const  toDeg = 180/ Math.PI, toRad = Math.PI/180
export default function CameraTab(){
    const settings = useContext(SettingsProvider)
    const [state] = useDirectState({
        zFar: settings.zFar,
        zNear: settings.zNear,
        fov: settings.fov * toDeg,
        radius: window.renderer.camera.radius
    })

    return (
        <>
            <label className={styles.label}>Clipping planes</label>
            <Range
                minLabelWidth={"30px"}
                label={"Far"}
                minValue={state.zNear + 1}
                variant={"embedded"}
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
                label={"Near"}
                variant={"embedded"}
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


            <label className={styles.label}>Field of view</label>
            <Range
                minLabelWidth={"30px"}
                label={"Fov"}
                minValue={10}
                maxValue={110}
                disabled={settings.ortho}
                variant={"embedded"}
                onFinish={(v) => {
                    settings.fov = v * toRad
                    state.fov = v
                    window.renderer.camera.fov = v * toRad
                    window.renderer.camera.updateProjection()
                }}
                value={state.fov}
                handleChange={v => state.fov = v}
            />


            <label className={styles.label}>Radius/Zoom</label>
            <Range
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

        </>
    )
}