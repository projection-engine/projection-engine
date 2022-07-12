import React, {useContext, useState} from "react"
import SettingsProvider from "../../../providers/SettingsProvider"
import {Checkbox} from "@f-ui/core"
import AccordionTemplate from "../../../../components/templates/AccordionTemplate"
import Range from "../../../../components/range/Range"
import styles from "../styles/Forms.module.css"

export default function EditorCamera() {
    const settings = useContext(SettingsProvider)
    const [state, setState] = useState({
        bloomStrength: settings.bloomStrength ? settings.bloomStrength : .3,
        bloomThreshold: settings.bloomThreshold ? settings.bloomThreshold : .85,

        gamma: settings.gamma,
        exposure: settings.exposure,
        filmGrainStrength: settings.filmGrainStrength ? settings.filmGrainStrength : .01,
        distortionStrength: settings.distortionStrength ? settings.distortionStrength : 1,
        chromaticAberrationStrength: settings.chromaticAberrationStrength ? settings.chromaticAberrationStrength : 1,
    })

    return (
        <div className={styles.ppWrapper}>
            <AccordionTemplate title={"Lens distortion"}>
                <Checkbox
                    noMargin={true}
                    checked={settings.distortion}
                    handleCheck={() => settings.distortion = !settings.distortion}
                    label={"Enabled"}
                    height={"25px"}
                    width={"100%"}
                />
                <Range
                    label={"Strength"}
                    disabled={!settings.distortion}
                    onFinish={v => settings.distortionStrength = v}
                    incrementPercentage={.01}
                    precision={3}
                    handleChange={v => setState({...state, distortionStrength: v})}
                    value={state.distortionStrength} maxValue={10} minValue={0}
                />
            </AccordionTemplate>

            <AccordionTemplate title={"Chromatic aberration"}>
                <Checkbox
                    noMargin={true}
                    checked={settings.chromaticAberration}
                    handleCheck={() => settings.chromaticAberration = !settings.chromaticAberration}
                    label={"Chromatic aberration"}
                    height={"25px"}
                    width={"100%"}
                />
                <Range
                    label={"Strength"}
                    disabled={!settings.chromaticAberration}
                    onFinish={v => settings.chromaticAberrationStrength = v}
                    incrementPercentage={.01}
                    precision={3}
                    handleChange={v => setState({...state, chromaticAberrationStrength: v})}
                    value={state.chromaticAberrationStrength} maxValue={10} minValue={0}/>
            </AccordionTemplate>

            <AccordionTemplate title={"Film grain"}>
                <Checkbox
                    noMargin={true}
                    checked={settings.filmGrain}
                    handleCheck={() => settings.filmGrain = !settings.filmGrain}
                    label={"Enabled"}
                    height={"25px"}
                    width={"100%"}
                />
				
                <Range
                    label={"Strength"}
                    disabled={!settings.filmGrain}
                    onFinish={v => settings.filmGrainStrength = v}
                    incrementPercentage={.001}
                    precision={3}
                    handleChange={v => setState({...state, filmGrainStrength: v})}
                    value={state.filmGrainStrength} maxValue={10} minValue={0}
                />
            </AccordionTemplate>

            <AccordionTemplate title={"Bloom"}>
                <Checkbox
                    noMargin={true}
                    checked={settings.bloom}
                    handleCheck={() => settings.bloom = !settings.bloom}
                    label={"Enabled"}
                    height={"25px"}
                    width={"100%"}/>

                <Range
                    label={"Strength"}

                    disabled={!settings.bloom}
                    onFinish={v => settings.bloomStrength = v}
                    incrementPercentage={.001}
                    precision={3}
                    handleChange={v => setState({...state, bloomStrength: v})}
                    value={state.bloomStrength} maxValue={10} minValue={0}/>

                <Range
                    label={"Threshold"}

                    disabled={!settings.bloom}
                    incrementPercentage={.001}
                    precision={3}

                    onFinish={v => settings.bloomThreshold = v}
                    handleChange={v => setState({...state, bloomThreshold: v})}
                    value={state.bloomThreshold}

                    maxValue={1} minValue={0}
                />
            </AccordionTemplate>

            <AccordionTemplate title={"Color correction"}>
                <Range
                    label={"Gamma"}

                    incrementPercentage={.001}
                    precision={3}
                    minValue={.1}
                    maxValue={10}
                    onFinish={v => settings.gamma = v}
                    handleChange={v => setState({...state, gamma: v})}
                    value={state.gamma}

                />

                <Range
                    label={"Exposure"}

                    minValue={.1}
                    incrementPercentage={.001}
                    precision={3}
                    maxValue={10}
                    onFinish={v => settings.exposure = v}
                    handleChange={v => setState({...state, exposure: v})}
                    value={state.exposure}
                />
            </AccordionTemplate>

        </div>
    )
}
