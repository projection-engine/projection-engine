import PropTypes from "prop-types"
import LabeledRange from "../../../../components/templates/LabeledRange"
import useDirectState from "../../../../components/hooks/useDirectState"
import COMPONENTS from "../../../engine/templates/COMPONENTS"
import React, {useEffect} from "react"
import styles from "../../component/styles/Forms.module.css"

export default function ViewportTab(props){
    const {engine} = props
    const [state] = useDirectState({})
    useEffect(() => {
        const t = engine.cursor.components[COMPONENTS.TRANSFORM].translation
        state.x= t[0]
        state.y= t[1]
        state.z= t[2]
    }, [engine.cursor])

    return (
        <>
            <label className={styles.label}>3D cursor position</label>
            <LabeledRange
                metric={"m"}
                accentColor={"red"}
                variant={"embedded"}
                label={"X"}
                value={state.x}
                precision={3}
                onFinish={e => state.x = e}
                incrementPercentage={.01}
                handleChange={e => {
                    const t = engine.cursor.components[COMPONENTS.TRANSFORM]
                    t.translation = [e, t.translation[1], t.translation[2]] 
                }}
            />
            <LabeledRange
                metric={"m"}
                accentColor={"#00ff00"}
                label={"Y"}
                variant={"embedded"}
                precision={3}
                incrementPercentage={.01}
                value={state.y}
                onFinish={e => state.y = e}
                handleChange={e => {
                    const t = engine.cursor.components[COMPONENTS.TRANSFORM]
                    t.translation = [t.translation[0], e, t.translation[2]]
                }}
            />
            <LabeledRange
                metric={"m"}
                accentColor={"blue"}
                label={"Z"}
                variant={"embedded"}
                precision={3}
                incrementPercentage={.01}
                value={state.z}
                onFinish={e => state.z = e}
                handleChange={e => {
                    const t = engine.cursor.components[COMPONENTS.TRANSFORM]
                    t.translation = [ t.translation[0], t.translation[1], e]
                }}
            />
        </>
    )
}
ViewportTab.propTypes={
    engine: PropTypes.object
}