import {useContext, useState} from "react";
import SettingsProvider from "../../../pages/project/utils/hooks/SettingsProvider";
import {Checkbox} from "@f-ui/core";
import AccordionTemplate from "../../../components/accordion/AccordionTemplate";
import Range from "../../../components/range/Range";

export default function PostProcessingSettings() {
    const settings = useContext(SettingsProvider)
    const [state, setState] = useState({
        bloomStrength: settings.bloomStrength ? settings.bloomStrength : .3,
        bloomThreshold: settings.bloomThreshold ? settings.bloomThreshold : .85,
        FXAASpanMax: settings.FXAASpanMax ? settings.FXAASpanMax : 8,
        FXAAReduceMin: settings.FXAAReduceMin ? settings.FXAAReduceMin : 1 / 128,
        FXAAReduceMul: settings.FXAAReduceMul ? settings.FXAAReduceMul : 1 / 8
    })
    return (
        <>
            {/*FXAA*/}
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
                    value={state.bloomThreshold} maxValue={1} minValue={0}
                />
            </AccordionTemplate>
        </>
    )
}
