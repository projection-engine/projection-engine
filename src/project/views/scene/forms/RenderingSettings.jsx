import {useContext, useEffect} from "react";
import SettingsProvider from "../../../hooks/SettingsProvider";
import {Checkbox} from "@f-ui/core";
import AccordionTemplate from "../../../../components/accordion/AccordionTemplate";
import Range from "../../../../components/range/Range";
import styles from '../styles/Forms.module.css'
import useDirectState from "../../../hooks/useDirectState";

export default function RenderingSettings() {
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
    }, [])

    console.log(state.pcfSamples)
    return (
        <div className={styles.ppWrapper}>

            <Checkbox
                noMargin={true}
                checked={settings.fxaa}
                handleCheck={() => settings.fxaa = !settings.fxaa}
                label={'FXAA anti-aliasing'}
                height={'25px'}
                width={'100%'}/>
            <Checkbox
                noMargin={true}
                checked={settings.ao}
                handleCheck={() => settings.ao = !settings.ao}
                label={'Ambient occlusion'}
                height={'25px'}
                width={'100%'}/>

            <div className={styles.group}>
                <AccordionTemplate title={'Shadow atlas resolution'}>
                    <Range
                        accentColor={'red'}
                        onFinish={v => settings.shadowMapResolution = v}
                        incrementPercentage={1}
                        precision={0}
                        minValue={1}
                        handleChange={v => state.shadowMapResolution = v}
                        value={state.shadowMapResolution}
                    />
                </AccordionTemplate>
                <AccordionTemplate title={'Lights on atlas (More lights, lower resolution per light)'}>
                    <Range
                        accentColor={'red'}
                        onFinish={v => settings.shadowAtlasQuantity = v}
                        incrementPercentage={1}
                        precision={0}
                        minValue={1}
                        handleChange={v => state.shadowAtlasQuantity = v}
                        value={state.shadowAtlasQuantity}
                    />
                </AccordionTemplate>

                <AccordionTemplate title={'Soft shadows samples'}>
                    <Range
                        accentColor={'red'}
                        onFinish={v => settings.pcfSamples = v}
                        incrementPercentage={1}
                        precision={0}
                        minValue={1}
                        maxValue={10}
                        handleChange={v => state.pcfSamples = v}
                        value={state.pcfSamples}
                    />
                </AccordionTemplate>
            </div>

        </div>
    )
}
