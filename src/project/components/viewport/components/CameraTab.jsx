import PropTypes from "prop-types"
import useDirectState from "../../../../components/hooks/useDirectState"
import React,  {useContext} from "react"
import SettingsProvider from "../../../hooks/SettingsProvider"
import LabeledRange from "../../../../components/templates/LabeledRange"
import styles from "../../scene/styles/Forms.module.css"
const  toDeg = 180/ Math.PI, toRad = Math.PI/180
export default function CameraTab(props){
    const {engine} = props
    const settings = useContext(SettingsProvider)
    const [state] = useDirectState({
        zFar: settings.zFar,
        zNear: settings.zNear,
        fov: settings.fov * toDeg,
        radius: engine.renderer.camera.radius,
        centerOn: engine.renderer.camera.centerOn,

    })

    return (
        <>
            <label className={styles.label}>Clipping planes</label>
            <LabeledRange
                minLabelWidth={"30px"}
                label={"Far"}
                variant={"embedded"}
                onFinish={(v) => {
                    settings.zFar = v
                    state.zFar = v
                    engine.renderer.camera.zFar = v
                    engine.renderer.camera.updateProjection()
                }}
                value={state.zFar}
                handleChange={v => state.zFar = v}
            />
            <LabeledRange
                minLabelWidth={"30px"}
                label={"Near"}
                variant={"embedded"}
                onFinish={(v) => {
                    settings.zNear = v
                    state.zNear = v
                    engine.renderer.camera.zNear = v
                    engine.renderer.camera.updateProjection()
                }}
                value={state.zNear}
                handleChange={v => state.zNear = v}
            />


            <label className={styles.label}>Field of view</label>
            <LabeledRange
                minLabelWidth={"30px"}
                label={"Fov"}
                disabled={settings.ortho}
                variant={"embedded"}
                onFinish={(v) => {
                    settings.fov = v * toRad
                    state.fov = v
                    engine.renderer.camera.fov = v * toRad
                    engine.renderer.camera.updateProjection()
                }}
                value={state.fov}
                handleChange={v => state.fov = v}
            />

            <label className={styles.label}>Field of view</label>
            <LabeledRange
                minLabelWidth={"30px"}
                label={"X"}
                variant={"embedded"}
                onFinish={(v) => {
                    state.centerOn[0] = v
                    engine.renderer.camera.centerOn[0] = v
                    engine.renderer.camera.updateViewMatrix()
                }}
                value={state.centerOn[0]}
                handleChange={v => state.centerOn[0] = v}
            />
            <LabeledRange
                minLabelWidth={"30px"}
                label={"Y"}
                variant={"embedded"}
                onFinish={(v) => {
                    state.centerOn[1] = v
                    engine.renderer.camera.centerOn[1] = v
                    engine.renderer.camera.updateViewMatrix()
                }}
                value={state.centerOn[1]}
                handleChange={v => state.centerOn[1] = v}
            />
            <LabeledRange
                minLabelWidth={"30px"}
                label={"Z"}
                variant={"embedded"}
                onFinish={(v) => {
                    state.centerOn[2] = v
                    engine.renderer.camera.centerOn[2] = v
                    engine.renderer.camera.updateViewMatrix()
                }}
                value={state.centerOn[2]}
                handleChange={v => state.centerOn[2] = v}
            />
        </>
    )
}
CameraTab.propTypes={
    engine: PropTypes.object
}