import PropTypes from "prop-types"
import React, {useContext, useEffect} from "react"
import Range from "../../../../components/range/Range"
import AccordionTemplate from "../../../../components/templates/AccordionTemplate"
import styles from "../styles/Forms.module.css"
import useDirectState from "../../../hooks/useDirectState"
import {Checkbox} from "@f-ui/core"
import SettingsProvider from "../../../hooks/SettingsProvider"

const toDeg = 180 / Math.PI, toRad = Math.PI / 180
export default function Camera(props) {
    const [state] = useDirectState({})
    useEffect(() => {
        state.zNear = props.selected.zNear
        state.zFar = props.selected.zFar

        state.fov = Math.round(props.selected.fov * toDeg)
        state.aspectRatio = props.selected.aspectRatio

        state.bloom = props.selected.bloom
        state.bloomStrength = props.selected.bloomStrength
        state.bloomThreshold = props.selected.bloomThreshold

        state.gamma = props.selected.gamma
        state.exposure = props.selected.exposure

        state.filmGrain = props.selected.filmGrain
        state.filmGrainStrength = props.selected.filmGrainStrength

        state.distortion = props.selected.distortion
        state.distortionStrength = props.selected.distortionStrength


        state.chromaticAberration = props.selected.chromaticAberration
        state.chromaticAberrationStrength = props.selected.chromaticAberrationStrength
    }, [props])

    return (<div className={styles.ppWrapper}>
        <AccordionTemplate title={"FOV"}>
            <Range
                metric={"angle"}
                accentColor={"red"}
                value={state.fov} minValue={35}
                maxValue={175}
                precision={1}
                incrementPercentage={.1}
                onFinish={(v) => {
                    props.submit( "fov", v * toRad)
                }}
                handleChange={e => state.fov = e}
            />
        </AccordionTemplate>


        <AccordionTemplate title={"View planes"} type={"flex"}>
            <Range
                accentColor={"red"}
                value={state.zFar}
                metric={"Far"}
                precision={1}
                incrementPercentage={.1}
                onFinish={(v) => props.submit("zFar", v)}
                handleChange={e => {
                    state.zFar = e
                }}
            />
            <Range
                accentColor={"green"}
                value={state.zNear}
                metric={"Near"}
                precision={1}
                incrementPercentage={.1}
                onFinish={(v) => props.submit( "zNear", v)}
                handleChange={e => {
                    state.zNear = e
                }}/>
        </AccordionTemplate>


        <div className={styles.group}>
            <Checkbox
                noMargin={true}
                checked={state.distortion}
                handleCheck={() => {
                    props.submit("distortion", !state.distortion)
                    state.distortion = !state.distortion
                }}
                label={"Lens distortion"}
                height={"25px"}
                width={"100%"}/>
            <AccordionTemplate title={"Distortion strength"}>
                <Range accentColor={"red"} disabled={!state.distortion}
                    onFinish={v => props.submit("distortionStrength", v)}
                    incrementPercentage={.01}
                    precision={3}
                    handleChange={v => state.distortionStrength = v}
                    value={state.distortionStrength} maxValue={10} minValue={0}/>
            </AccordionTemplate>
        </div>

        <div className={styles.group}>
            <Checkbox
                noMargin={true}
                checked={state.chromaticAberration}
                handleCheck={() => {
                    props.submit("chromaticAberration", !state.chromaticAberration)
                    state.chromaticAberration = !state.chromaticAberration
                }}
                label={"Chromatic aberration"}
                height={"25px"}
                width={"100%"}/>
            <AccordionTemplate title={"Chromatic aberration strength"}>
                <Range accentColor={"red"} disabled={!state.chromaticAberration}
                    onFinish={v => props.submit("chromaticAberrationStrength", v)}
                    incrementPercentage={.01}
                    precision={3}
                    handleChange={v => state.chromaticAberrationStrength = v}
                    value={state.chromaticAberrationStrength} maxValue={10} minValue={0}/>
            </AccordionTemplate>
        </div>
        <div className={styles.group}>
            <Checkbox
                noMargin={true}
                checked={state.filmGrain}
                handleCheck={() => {
                    props.submit("filmGrain", !state.filmGrain)
                    state.filmGrain = !state.filmGrain
                }}
                label={"Film grain"}
                height={"25px"}
                width={"100%"}/>
            <AccordionTemplate title={"Film grain strength"}>
                <Range accentColor={"red"} disabled={!state.filmGrain}
                    onFinish={v => props.submit("filmGrain", v)}
                    incrementPercentage={.001}
                    precision={3}
                    handleChange={v => state.filmGrainStrength = v}
                    value={state.filmGrainStrength} maxValue={10} minValue={0}/>
            </AccordionTemplate>
        </div>

        <div className={styles.group}>
            <Checkbox
                noMargin={true}
                checked={state.bloom}
                handleCheck={() => {
                    props.submit("bloom", !state.bloom)
                    state.bloom = !state.bloom
                }}
                label={"Bloom"}
                height={"25px"}
                width={"100%"}/>
            <AccordionTemplate title={"Bloom strength"}>
                <Range accentColor={"red"} disabled={!state.bloom}

                    incrementPercentage={.001}
                    precision={3}
                    onFinish={v => props.submit("bloomStrength", v)}
                    handleChange={v => state.bloomStrength = v}
                    value={state.bloomStrength} maxValue={10} minValue={0}/>
            </AccordionTemplate>
            <AccordionTemplate title={"Bloom threshold"}>
                <Range
                    accentColor={"green"} disabled={!state.bloom}
                    incrementPercentage={.001}
                    precision={3}

                    onFinish={v => props.submit("bloomThreshold", v)}
                    handleChange={v => state.bloomThreshold = v}
                    value={state.bloomThreshold}

                    maxValue={1} minValue={0}
                />
            </AccordionTemplate>

        </div>
        {/*COLOR CORRECTION*/}
        <div className={styles.group}>
            <AccordionTemplate title={"Gamma"}>
                <Range
                    accentColor={"yellow"}
                    incrementPercentage={.001}
                    precision={3}
                    minValue={.1}
                    maxValue={10}


                    onFinish={v => props.submit("gamma", v)}
                    handleChange={v => state.gamma = v}
                    value={state.gamma}

                />
            </AccordionTemplate>
            <AccordionTemplate title={"Exposure"}>
                <Range
                    accentColor={"white"}
                    minValue={.1}
                    incrementPercentage={.001}
                    precision={3}
                    maxValue={10}


                    onFinish={v => props.submit("exposure", v)}
                    handleChange={v => state.exposure = v}
                    value={state.exposure}
                />
            </AccordionTemplate>
        </div>
    </div>
    )
}

Camera.propTypes = {
    selected: PropTypes.object, submit: PropTypes.func,
}
