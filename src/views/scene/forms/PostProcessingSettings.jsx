import {useContext, useState} from "react";
import SettingsProvider from "../../../pages/project/utils/hooks/SettingsProvider";
import {Accordion, AccordionSummary, Checkbox} from "@f-ui/core";
import AccordionTemplate from "../../../components/accordion/AccordionTemplate";
import Range from "../../../components/range/Range";

export default function PostProcessingSettings() {
    const settings = useContext(SettingsProvider)
    const [state, setState] = useState({
        bloomStrength: settings.bloomStrength ? settings.bloomStrength : .3,
        bloomThreshold: settings.bloomThreshold ? settings.bloomThreshold : .85,
        FXAASpanMax: settings.FXAASpanMax ? settings.FXAASpanMax : 8,
        FXAAReduceMin: settings.FXAAReduceMin ? settings.FXAAReduceMin : 1 / 128,
        FXAAReduceMul: settings.FXAAReduceMul ? settings.FXAAReduceMul : 1 / 8,
        gamma: settings.gamma,
        exposure: settings.exposure,
        filmGrainStrength: settings.filmGrainStrength ? settings.filmGrainStrength : .01
    })
    return (
        <>
            <Checkbox
                noMargin={true}
                checked={settings.fxaa}
                handleCheck={() => settings.fxaa = !settings.fxaa}
                label={'FXAA anti-aliasing'}
                width={'100%'}/>
            {/*<AccordionTemplate title={'Bloom strength'}>*/}
            {/*    <Range accentColor={'red'} disabled={!settings.bloom}*/}
            {/*           handleChange={v => setState({...state, bloomStrength: v})}*/}
            {/*           value={state.bloomStrength} maxValue={10} minValue={0}/>*/}
            {/*</AccordionTemplate>*/}
            {/*<AccordionTemplate title={'Bloom strength'}>*/}
            {/*    <Range accentColor={'red'} disabled={!settings.bloom}*/}
            {/*           handleChange={v => setState({...state, bloomStrength: v})}*/}
            {/*           value={state.bloomStrength} maxValue={10} minValue={0}/>*/}
            {/*</AccordionTemplate>*/}
            {/*<AccordionTemplate title={'Bloom strength'}>*/}
            {/*    <Range accentColor={'red'} disabled={!settings.bloom}*/}
            {/*           handleChange={v => setState({...state, bloomStrength: v})}*/}
            {/*           value={state.bloomStrength} maxValue={10} minValue={0}/>*/}
            {/*</AccordionTemplate>*/}
            {/*<AccordionTemplate title={'Bloom strength'}>*/}
            {/*    <Range accentColor={'red'} disabled={!settings.bloom}*/}
            {/*           handleChange={v => setState({...state, bloomStrength: v})}*/}
            {/*           value={state.bloomStrength} maxValue={10} minValue={0}/>*/}
            {/*</AccordionTemplate>*/}

            <Checkbox
                checked={settings.filmGrain}
                handleCheck={() => settings.filmGrain = !settings.filmGrain}
                label={'Film grain'}
                width={'100%'}/>
            <AccordionTemplate title={'Film grain strength'}>
                <Range accentColor={'red'} disabled={!settings.filmGrain}
                       onFinish={v => settings.filmGrainStrength = v}
                       incrementPercentage={.001}
                       precision={3}
                       handleChange={v => setState({...state, filmGrainStrength: v})}
                       value={state.filmGrainStrength} maxValue={10} minValue={0}/>
            </AccordionTemplate>

            {/*BLOOM*/}
            <Checkbox
                checked={settings.bloom}
                handleCheck={() => settings.bloom = !settings.bloom}
                label={'Bloom'}
                width={'100%'}/>
            <AccordionTemplate title={'Bloom strength'}>
                <Range accentColor={'red'} disabled={!settings.bloom}
                       onFinish={v => settings.bloomStrength = v}
                       incrementPercentage={.001}
                       precision={3}
                       handleChange={v => setState({...state, bloomStrength: v})}
                       value={state.bloomStrength} maxValue={10} minValue={0}/>
            </AccordionTemplate>
            <AccordionTemplate title={'Bloom threshold'}>
                <Range
                    accentColor={'green'} disabled={!settings.bloom}
                    incrementPercentage={.001}
                    precision={3}

                    onFinish={v => settings.bloomThreshold = v}
                    handleChange={v => setState({...state, bloomThreshold: v})}
                    value={state.bloomThreshold}

                    maxValue={1} minValue={0}
                />
            </AccordionTemplate>



            {/*COLOR CORRECTION*/}
            <AccordionTemplate title={'gamma'}>
                <Range
                    accentColor={'yellow'}
                    incrementPercentage={.001}
                    precision={3}
                    minValue={.1}
                    maxValue={10}


                    onFinish={v => settings.gamma = v}
                    handleChange={v => setState({...state, gamma: v})}
                    value={state.gamma}

                />
            </AccordionTemplate>
            <AccordionTemplate title={'Exposure'}>
                <Range
                    accentColor={'white'}
                    minValue={.1}
                    incrementPercentage={.001}
                    precision={3}
                    maxValue={10}


                    onFinish={v => settings.exposure = v}
                    handleChange={v => setState({...state, exposure: v})}
                    value={state.exposure}
                />
            </AccordionTemplate>
        </>
    )
}
