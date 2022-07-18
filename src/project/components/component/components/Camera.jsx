import PropTypes from "prop-types"
import React, {useEffect} from "react"
import Range from "../../../../components/range/Range"
import AccordionTemplate from "../../../../components/accordion/AccordionTemplate"
import styles from "../styles/Forms.module.css"
import useDirectState from "../../../../components/hooks/useDirectState"
import {Checkbox} from "@f-ui/core"
import useLocalization from "../../../../global/useLocalization"
import PostProcessing from "./PostProcessing"

const toDeg = 180 / Math.PI, toRad = Math.PI / 180
export default function Camera(props) {
    const [
        state,
        clear,
        dispatchBlock
    ] = useDirectState(
        {},
        (key, value) => {
            props.selected[key] = value
        }
    )
    const translate = useLocalization("PROJECT", "COMPONENT_EDITOR")
    useEffect(() => {
        if (state.id !== props.selected.id)
            clear()
        const newState = {...props.selected}
        newState.fov = Math.round(props.selected.fov * toDeg)
        dispatchBlock(newState)
    }, [props.selected])


    return (
        <>
            <Range
                label={translate("FOV")}
                disabled={state.ortho}
                value={state.fov} minValue={35}
                maxValue={175}
                precision={1}
                incrementPercentage={.1}
                onFinish={(v) => {
                    props.submit("fov", v * toRad)
                    state.fov = v
                }}
            />
            <AccordionTemplate title={translate("ORTHO_PROJECTION")}>
                <Checkbox
                    noMargin={true}
                    checked={state.ortho}
                    handleCheck={() => {
                        props.submit("ortho", !state.ortho)
                        state.ortho = !state.ortho
                    }}
                    label={translate("ENABLED")}
                    height={"25px"}
                    width={"100%"}/>
                <Range
                    label={translate("PROJECTION_SIZE")}
                    disabled={!state.ortho}
                    onFinish={v => {
                        props.submit("size", v)
                        state.size = v
                    }}
                    incrementPercentage={.01}
                    precision={3}
                    value={state.size}
                    minValue={0}
                />
            </AccordionTemplate>
            <AccordionTemplate title={translate("VIEW_PLANES")} type={"flex"}>
                <Range
                    value={state.zFar}
                    label={translate("FAR")}
                    precision={1}
                    incrementPercentage={.1}
                    onFinish={(v) => {
                        props.submit("zFar", v)
                        state.zFar = v
                    }}
                />
                <Range
                    value={state.zNear}
                    label={translate("NEAR")}
                    precision={1}
                    incrementPercentage={.1}
                    onFinish={(v) => {
                        props.submit("zNear", v)
                        state.zNear = v
                    }}
                />
            </AccordionTemplate>
            <PostProcessing selected={state}/>
        </>
    )
}

Camera.propTypes = {
    selected: PropTypes.object, submit: PropTypes.func,
}
