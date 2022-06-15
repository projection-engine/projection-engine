import PropTypes from "prop-types"
import useDirectState from "../../../../components/hooks/useDirectState"
import React, {useContext} from "react"
import SettingsProvider from "../../../hooks/SettingsProvider"
import LabeledRange from "../../../../components/templates/LabeledRange"
import styles from "../../component-editor/styles/Forms.module.css"
import Range from "../../../../components/range/Range"

const  toDeg = 180/ Math.PI, toRad = Math.PI/180
export default function CameraTab(props){
    const {engine} = props
    const settings = useContext(SettingsProvider)
    const [state] = useDirectState({
        zFar: settings.zFar,
        zNear: settings.zNear,
        fov: settings.fov * toDeg,
        radius: engine.renderer.camera.radius
    })

    return (
        <>

            <label className={styles.label}>Clipping planes</label>
            <LabeledRange
                minLabelWidth={"30px"}
                label={"Far"}
                minValue={state.zNear + 1}
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
                maxValue={state.zFar - 1}
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
                minValue={10}
                maxValue={110}
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


            <label className={styles.label}>Radius/Zoom</label>
            <Range
                onFinish={(v) => {
                    settings.radius = v
                    state.radius = v
                    engine.renderer.camera.radius = v
                    engine.renderer.camera.updateViewMatrix()
                }}
                hideValue={true}
                value={state.radius}
                handleChange={v => {
                    state.radius = v
                    engine.renderer.camera.radius = v
                    engine.renderer.camera.updateViewMatrix()
                }}
            />

        </>
    )
}
CameraTab.propTypes={
    engine: PropTypes.object
}