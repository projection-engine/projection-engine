import {useContext, useEffect} from "react";
import SettingsProvider from "../../../hooks/SettingsProvider";
import {Checkbox} from "@f-ui/core";
import AccordionTemplate from "../../../../components/templates/AccordionTemplate";
import styles from '../styles/Forms.module.css'
import useDirectState from "../../../hooks/useDirectState";
import LabeledRange from "../../../../components/templates/LabeledRange";

export default function Rendering() {
    const settings = useContext(SettingsProvider)
    const [state] = useDirectState({})
    useEffect(() => {
        state.FXAASpanMax = settings.FXAASpanMax ? settings.FXAASpanMax : 8
        state.FXAAReduceMin = settings.FXAAReduceMin ? settings.FXAAReduceMin : 1 / 128
        state.FXAAReduceMul = settings.FXAAReduceMul ? settings.FXAAReduceMul : 1 / 8

        state.fxaa = settings.fxaa
        state.ao = settings.ao
        state.shadowMapResolution = settings.shadowMapResolution
        state.shadowAtlasQuantity = settings.shadowAtlasQuantity
        state.pcfSamples = settings.pcfSamples

        state.total_strength = settings.total_strength
        state.base = settings.base
        state.area = settings.area
        state.falloff = settings.falloff
        state.radius = settings.radius
        state.samples = settings.samples
    }, [])


    return (
        <div className={styles.ppWrapper}>

            <Checkbox
                noMargin={true}
                checked={settings.fxaa}
                handleCheck={() => settings.fxaa = !settings.fxaa}
                label={'FXAA anti-aliasing'}
                height={'25px'}
                width={'100%'}/>


            <AccordionTemplate title={'Shadows'}>

                <LabeledRange
                    label={'Atlas resolution'}
                    accentColor={'red'}
                    onFinish={v => settings.shadowMapResolution = v}
                    incrementPercentage={1}
                    precision={0}
                    minValue={1}
                    handleChange={v => state.shadowMapResolution = v}
                    value={state.shadowMapResolution}
                />
                <div className={styles.inline}>
                    <LabeledRange
                        label={'Lights'}
                        accentColor={'red'}
                        onFinish={v => settings.shadowAtlasQuantity = v}
                        incrementPercentage={1}
                        precision={0}
                        minValue={1}
                        handleChange={v => state.shadowAtlasQuantity = v}
                        value={state.shadowAtlasQuantity}
                    />

                    <LabeledRange
                        label={'Smoothing samples'}
                        accentColor={'green'}
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

            <AccordionTemplate title={'Ambient occlusion'}>
                <Checkbox
                    noMargin={true}
                    checked={settings.ao}
                    handleCheck={() => settings.ao = !settings.ao}
                    label={'Ambient occlusion'}
                    height={'25px'}
                    width={'100%'}/>
                <div className={styles.inline}>
                    <LabeledRange
                        disabled={!settings.ao}
                        label={'Strength'}
                        accentColor={'red'}
                        onFinish={v => settings.total_strength = v}
                        incrementPercentage={.001}
                        precision={3}
                        minValue={0}
                        handleChange={v => state.total_strength = v}
                        value={state.total_strength}
                    />
                    <LabeledRange
                        disabled={!settings.ao}
                        label={'Base'}
                        accentColor={'green'}
                        onFinish={v => settings.base = v}
                        incrementPercentage={.001}
                        precision={3}
                        minValue={0}
                        handleChange={v => state.base = v}
                        value={state.base}
                    />
                </div>

                <div className={styles.inline}>
                    <LabeledRange
                        disabled={!settings.ao}
                        label={'Area'}
                        accentColor={'red'}
                        onFinish={v => settings.area = v}
                        incrementPercentage={.001}
                        precision={3}
                        minValue={0}
                        handleChange={v => state.area = v}
                        value={state.area}
                    />
                    <LabeledRange
                        disabled={!settings.ao}
                        label={'Falloff'}
                        accentColor={'green'}
                        onFinish={v => settings.falloff = v}
                        incrementPercentage={.001}
                        precision={3}
                        minValue={0}
                        handleChange={v => state.falloff = v}
                        value={state.falloff}
                    />
                </div>

                <div className={styles.inline}>
                    <LabeledRange
                        disabled={!settings.ao}
                        label={'Radius'}
                        accentColor={'red'}
                        onFinish={v => settings.radius = v}
                        incrementPercentage={.001}
                        precision={3}
                        minValue={0}
                        handleChange={v => state.radius = v}
                        value={state.radius}
                    />

                    <LabeledRange
                        label={'Samples'}
                        accentColor={'red'}
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
        </div>
    )
}
