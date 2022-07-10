import PropTypes from "prop-types"
import React, {useEffect, useState} from "react"
import Transformation from "../../../engine/utils/Transformation"
import {HISTORY_ACTIONS} from "../../../hooks/historyReducer"
import COMPONENTS from "../../../engine/templates/COMPONENTS"

import Range from "../../../../components/range/Range"
import styles from "../styles/Forms.module.css"

export default function Transform(props) {
    const [state, setState] = useState({})
    const getNewState = () => {
        const euler = props.selected.rotationUpdated ? props.selected.rotation : Transformation.getEuler(props.selected.rotationQuat)
        return {
            xT: props.selected.translation[0],
            yT: props.selected.translation[1],
            zT: props.selected.translation[2],

            xS: props.selected.scaling[0],
            yS: props.selected.scaling[1],
            zS: props.selected.scaling[2],

            xR: euler[0] * 180 / Math.PI,
            yR: euler[1] * 180 / Math.PI,
            zR: euler[2] * 180 / Math.PI,
        }
    }
    useEffect(() => {
        setState(getNewState())
    }, [props])


    return (
        <>
            <label className={styles.label}>Translation</label>
            <Range
                accentColor={"red"}
                variant={"embedded"}
                label={"X"}
                value={state.xT}
                precision={3}
                incrementPercentage={.01}
                onFinish={(v) => {
                    setState({
                        ...state,
                        xT: v
                    })
                }}
                handleChange={e => {
                    props.selected.translation[0] = e
                    props.selected.changed = true
                }}
            />
            <Range
                accentColor={"#00ff00"}
                label={"Y"}
                variant={"embedded"}
                precision={3}
                incrementPercentage={.01}
                value={state.yT}
                onFinish={(v) => {
                    setState({
                        ...state,
                        yT: v
                    })
                }}
                handleChange={e => {
                    props.selected.translation[1] = e
                    props.selected.changed = true
                }}
            />
            <Range
                accentColor={"blue"}
                label={"Z"}
                variant={"embedded"}
                precision={3}
                incrementPercentage={.01}
                value={state.zT}
                onFinish={(v) => {
                    setState({
                        ...state,
                        zT: v
                    })
                    // window.renderer.
                }}
                handleChange={e => {
                    props.selected.translation[2] = e
                    props.selected.changed = true

                }}
            />

            <label className={styles.label} style={{marginTop: "4px"}}>Scaling</label>
            <Range
                disabled={props.selected.lockedScaling}
                accentColor={"red"}
                label={"X"}
                variant={"embedded"}
                value={state.xS}
                minValue={0.001}
                precision={3}

                incrementPercentage={.01}
                onFinish={(v) => {
                    props.submitScaling("x", v)
                }}
                handleChange={e => {
                    props.selected.scaling = [e, props.selected.scaling[1], props.selected.scaling[2]]
                    setState({...state, xS: e})

                }}
            />
            <Range
                disabled={props.selected.lockedScaling}
                accentColor={"#00ff00"}
                label={"Y"}
                variant={"embedded"}
                value={state.yS}
                minValue={0.001}
                precision={3}
                incrementPercentage={.01}
                onFinish={(v) => {
                    props.submitScaling("y", v)
                }}
                handleChange={e => {
                    props.selected.scaling = [props.selected.scaling[0], e, props.selected.scaling[2]]
                    setState({...state, yS: e})

                }}/>
            <Range
                disabled={props.selected.lockedScaling}
                accentColor={"blue"}
                label={"Z"}
                variant={"embedded"}
                value={state.zS}
                minValue={0.001}
                precision={3}
                incrementPercentage={.01}
                onFinish={(v) => {
                    props.submitScaling("z", v)
                }}
                handleChange={e => {
                    props.selected.scaling = [props.selected.scaling[0], props.selected.scaling[1], e]
                    setState({...state, zS: e})

                }}
            />

            <label className={styles.label} style={{marginTop: "4px"}}>Rotation</label>
            <Range
                disabled={props.selected.lockedRotation}
                accentColor={"red"}
                label={"X"}
                variant={"embedded"}
                metric={"angle"}
                value={state.xR}
                onFinish={(v) => {
                    props.submitRotation("x", v * Math.PI / 180)
                }}
                handleChange={e => {
                    props.selected.rotation = [parseFloat(e) * Math.PI / 180, props.selected.rotation[1], props.selected.rotation[2]]
                    setState({...state, xR: parseFloat(e)})
                }}/>
            <Range
                disabled={props.selected.lockedRotation}
                metric={"angle"}
                accentColor={"#00ff00"}
                label={"Y"}
                variant={"embedded"}
                value={state.yR}
                onFinish={(v) => {
                    props.submitRotation("y", v * Math.PI / 180)
                }}
                handleChange={e => {
                    props.selected.rotation = [props.selected.rotation[0], parseFloat(e) * Math.PI / 180, props.selected.rotation[2]]
                    setState({...state, yR: parseFloat(e)})
                }}/>
            <Range
                accentColor={"blue"}
                disabled={props.selected.lockedRotation}
                metric={"angle"}
                label={"Z"}
                variant={"embedded"}
                value={state.zR}
                onFinish={(v) => {
                    props.submitRotation("z", v * Math.PI / 180)
                }}
                handleChange={e => {
                    props.selected.rotation = [props.selected.rotation[0], props.selected.rotation[1], parseFloat(e) * Math.PI / 180]
                    setState({...state, zR: parseFloat(e)})
                }}
            />
        </>
    )
}

Transform.propTypes = {
    engine: PropTypes.object,
    entityID: PropTypes.string,

    selected: PropTypes.object,
    submitRotation: PropTypes.func,
    submitTranslation: PropTypes.func,
    submitScaling: PropTypes.func
}