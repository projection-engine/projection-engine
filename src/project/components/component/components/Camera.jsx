import PropTypes from "prop-types"
import React, {useEffect} from "react"
import Range from "../../../../components/range/Range"
import AccordionTemplate from "../../../../components/accordion/AccordionTemplate"
import styles from "../styles/Forms.module.css"
import useDirectState from "../../../../components/hooks/useDirectState"
import {Checkbox} from "@f-ui/core"
import useLocalization from "../../../../global/useLocalization"

const toDeg = 180 / Math.PI, toRad = Math.PI / 180
export default function Camera(props) {
    const [state, , dispatchBlock] = useDirectState({})
    const translate = useLocalization("PROJECT", "COMPONENT_EDITOR")
    useEffect(() => {
        const newState = {}
        newState.zNear = props.selected.zNear
        newState.zFar = props.selected.zFar

        newState.fov = Math.round(props.selected.fov * toDeg)
        newState.aspectRatio = props.selected.aspectRatio

        newState.bloom = props.selected.bloom
        newState.bloomStrength = props.selected.bloomStrength
        newState.bloomThreshold = props.selected.bloomThreshold

        newState.gamma = props.selected.gamma
        newState.exposure = props.selected.exposure

        newState.filmGrain = props.selected.filmGrain
        newState.filmGrainStrength = props.selected.filmGrainStrength

        newState.distortion = props.selected.distortion
        newState.distortionStrength = props.selected.distortionStrength


        newState.chromaticAberration = props.selected.chromaticAberration
        newState.chromaticAberrationStrength = props.selected.chromaticAberrationStrength
        newState.ortho = props.selected.ortho
        newState.size = props.selected.size

        dispatchBlock(newState)
    }, [props])

    return (
        <div className={styles.ppWrapper}>
            <div className={styles.group}>
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
                        onFinish={v => props.submit("size", v)}
                        incrementPercentage={.01}
                        precision={3}
                        handleChange={v => state.size = v}
                        value={state.size}
                        minValue={0}
                    />
                </AccordionTemplate>
            </div>

            <Range
                label={translate("FOV")}
                disabled={state.ortho}
                value={state.fov} minValue={35}
                maxValue={175}
                precision={1}
                incrementPercentage={.1}
                onFinish={(v) => {
                    props.submit("fov", v * toRad)
                }}
                handleChange={e => state.fov = e}
            />


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
