import React, {useContext, useEffect} from "react"
import SettingsProvider from "../../../context/SettingsProvider"
import {Checkbox} from "@f-ui/core"
import AccordionTemplate from "../../../../components/templates/AccordionTemplate"
import styles from "../styles/Forms.module.css"
import useDirectState from "../../../../components/hooks/useDirectState"
import Range from "../../../../components/range/Range"

export default function Rendering() {
    const settings = useContext(SettingsProvider)
    const [state] = useDirectState({})
    useEffect(() => {
        state.FXAASpanMax = settings.FXAASpanMax
        state.FXAAReduceMin = settings.FXAAReduceMin
        state.FXAAReduceMul = settings.FXAAReduceMul

        state.shadowMapResolution = settings.shadowMapResolution
        state.shadowAtlasQuantity = settings.shadowAtlasQuantity
        state.pcfSamples = settings.pcfSamples

        state.total_strength = settings.total_strength
        state.base = settings.base
        state.area = settings.area
        state.falloff = settings.falloff
        state.radius = settings.radius
        state.samples = settings.samples

        state.ssgiQuality = settings.ssgiQuality
        state.ssgiBrightness = settings.ssgiBrightness
        state.ssgiStepSize = settings.ssgiStepSize

        state.ssrMaxSteps = settings.ssrMaxSteps
        state.ssrStepSize = settings.ssrStepSize


    }, [])


    return (
        <>
            <AccordionTemplate title={"Resolution"}>
                <Range
                    label={"X"}
                    variant={"embedded"}
                    onFinish={v => settings.resolution = [v, settings.resolution[1]]}
                    incrementPercentage={1}
                    precision={0}
                    handleChange={() => null}
                    value={settings.resolution[0]}
                    minValue={1}
                />
                <Range
                    label={"Y"}
                    variant={"embedded"}
                    onFinish={v => settings.resolution = [settings.resolution[0], v]}
                    incrementPercentage={1}
                    precision={0}
                    handleChange={() => null}
                    value={settings.resolution[1]}
                    minValue={1}
                />
            </AccordionTemplate>
            <Checkbox
                noMargin={true}
                checked={settings.fxaa}
                handleCheck={() => settings.fxaa = !settings.fxaa}
                label={"Anti-aliasing"}
                height={"25px"}
                width={"100%"}/>

            <AccordionTemplate title={"Screen space reflections"}>
                <Checkbox
                    noMargin={true}
                    checked={settings.ssr}
                    handleCheck={() => settings.ssr = !settings.ssr}
                    label={"Enabled"}
                    height={"25px"}
                    width={"100%"}
                />
                <Range
                    disabled={!settings.ssr}
                    label={"Steps"}
                    onFinish={v => settings.ssrMaxSteps = v}
                    incrementPercentage={1}
                    precision={0}
                    minValue={0}
                    maxValue={100}
                    handleChange={v => window.renderer.params.ssrMaxSteps = v}
                    value={state.ssrMaxSteps}
                />
                <Range
                    disabled={!settings.ssr}
                    label={"Step size"}
                    onFinish={v => settings.ssrStepSize = v}
                    incrementPercentage={.001}
                    precision={4}
                    minValue={.05}
                    maxValue={1}
                    handleChange={v => window.renderer.params.ssrStepSize = v}
                    value={state.ssrStepSize}
                />
            </AccordionTemplate>


            <AccordionTemplate title={"Global illumination"}>
                <Checkbox
                    noMargin={true}
                    checked={settings.ssgi}
                    handleCheck={() => settings.ssgi = !settings.ssgi}
                    label={"Enabled"}
                    height={"25px"}
                    width={"100%"}
                />
                <Range
                    disabled={!settings.ssgi}
                    label={"Steps"}
                    onFinish={v => settings.ssgiQuality = v}
                    incrementPercentage={1}
                    precision={0}
                    minValue={0}
                    maxValue={100}
                    handleChange={v => window.renderer.params.ssgiQuality = v}
                    value={state.ssgiQuality}
                />

                <Range
                    disabled={!settings.ssgi}
                    label={"Intensity"}
                    onFinish={v => {
                        settings.ssgiBrightness = v
                        state.ssgiBrightness = v
                    }}
                    incrementPercentage={.001}
                    precision={4}
                    minValue={0}
                    maxValue={10}
                    handleChange={v => {
                        // state.ssgiBrightness = v
                        window.renderer.params.ssgiBrightness = v
                    }}
                    value={state.ssgiBrightness}
                />

                <Range
                    disabled={!settings.ssgi}
                    label={"Step size"}
                    onFinish={v => {
                        settings.ssgiStepSize = v
                        state.ssgiStepSize = v
                    }}
                    incrementPercentage={.001}
                    precision={4}
                    minValue={.05}
                    maxValue={1}
                    handleChange={v => window.renderer.params.ssgiStepSize = v}
                    value={state.ssgiStepSize}
                />

            </AccordionTemplate>
            
            <AccordionTemplate title={"Shadows"}>

                <Range
                    label={"Atlas resolution"}
                    accentColor={"red"}
                    onFinish={v => settings.shadowMapResolution = v}
                    incrementPercentage={1}
                    precision={0}
                    minValue={1}
                    handleChange={v => state.shadowMapResolution = v}
                    value={state.shadowMapResolution}
                />
                <div className={styles.inline}>
                    <Range
                        label={"Lights"}
                        accentColor={"red"}
                        onFinish={v => settings.shadowAtlasQuantity = v}
                        incrementPercentage={1}
                        precision={0}
                        minValue={1}
                        handleChange={v => state.shadowAtlasQuantity = v}
                        value={state.shadowAtlasQuantity}
                    />

                    <Range
                        label={"Smoothing samples"}
                        accentColor={"green"}
                        onFinish={v => settings.pcfSamples = v}
                        incrementPercentage={1}
                        precision={0}
                        minValue={1}
                        maxValue={10}
                        handleChange={v => state.pcfSamples = v}
                        value={state.pcfSamples}
                    />
                </div>
            </AccordionTemplate>

            <AccordionTemplate title={"Ambient occlusion"}>
                <Checkbox
                    noMargin={true}
                    checked={settings.ao}
                    handleCheck={() => settings.ao = !settings.ao}
                    label={"Enabled"}
                    height={"25px"}
                    width={"100%"}/>
                <div className={styles.inline}>
                    <Range
                        disabled={!settings.ao}
                        label={"Strength"}
                        accentColor={"red"}
                        onFinish={v => settings.total_strength = v}
                        incrementPercentage={.001}
                        precision={3}
                        minValue={0}
                        handleChange={v => state.total_strength = v}
                        value={state.total_strength}
                    />
                    <Range
                        disabled={!settings.ao}
                        label={"Base"}
                        accentColor={"green"}
                        onFinish={v => settings.base = v}
                        incrementPercentage={.001}
                        precision={3}
                        minValue={0}
                        handleChange={v => state.base = v}
                        value={state.base}
                    />
                </div>

                <div className={styles.inline}>
                    <Range
                        disabled={!settings.ao}
                        label={"Area"}
                        accentColor={"red"}
                        onFinish={v => settings.area = v}
                        incrementPercentage={.001}
                        precision={3}
                        minValue={0}
                        handleChange={v => state.area = v}
                        value={state.area}
                    />
                    <Range
                        disabled={!settings.ao}
                        label={"Falloff"}
                        accentColor={"green"}
                        onFinish={v => settings.falloff = v}
                        incrementPercentage={.001}
                        precision={3}
                        minValue={0}
                        handleChange={v => state.falloff = v}
                        value={state.falloff}
                    />
                </div>

                <div className={styles.inline}>
                    <Range
                        disabled={!settings.ao}
                        label={"Radius"}
                        accentColor={"red"}
                        onFinish={v => settings.radius = v}
                        incrementPercentage={.001}
                        precision={3}
                        minValue={0}
                        handleChange={v => state.radius = v}
                        value={state.radius}
                    />

                    <Range
                        label={"Samples"}
                        accentColor={"red"}
                        onFinish={v => settings.samples = v}
                        incrementPercentage={1}
                        precision={0}
                        minValue={1} disabled={true}
                        maxValue={10}
                        handleChange={v => state.samples = v}
                        value={state.samples}
                    />
                </div>
            </AccordionTemplate>
        </>
    )
}
