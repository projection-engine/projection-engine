import {useContext, useEffect, useState} from "react";
import SettingsProvider from "../../../utils/hooks/SettingsProvider";
import {Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import AccordionTemplate from "../../../../components/templates/AccordionTemplate";
import Range from "../../../../components/range/Range";

export default function Display() {
    const settings = useContext(SettingsProvider)
    const [state, setState] = useState({
        height: settings.resolution[1],
        width:settings.resolution[0],
    })
    useEffect(() => {
        setState({
            height: settings.resolution[1],
            width:settings.resolution[0],
        })
    }, [settings.resolution])
    return (
        <>
            <AccordionTemplate title={'Resolution X'}>
                <Range
                    accentColor={'red'}
                    onFinish={v => settings.resolution = [v, settings.resolution[1]]}
                    incrementPercentage={1}
                    precision={0}
                    handleChange={v => setState({...state, width: v})}
                    value={state.width}
                    minValue={1}/>
            </AccordionTemplate>
            <AccordionTemplate title={'Resolution Y'}>
                <Range
                    accentColor={'green'}
                    onFinish={v => settings.resolution = [settings.resolution[0], v]}
                    incrementPercentage={1}
                    precision={0}
                    handleChange={v => setState({...state, height: v})}
                    value={state.height}
                    minValue={1}/>
            </AccordionTemplate>

            <AccordionTemplate title={'Framerate'}>
                <Dropdown styles={{width: '100%', justifyContent: 'space-between', background: 'var(--fabric-border-primary)'}}>
                    {settings.frameRate}fps
                    <DropdownOptions>
                        <DropdownOption option={{
                            label: '24fps',
                            highlight: settings.frameRate === 24,
                            onClick: () => settings.frameRate = 24
                        }}/>
                        <DropdownOption option={{
                            label: '30fps',
                            highlight: settings.frameRate === 30,
                            onClick: () => settings.frameRate = 30
                        }}/>
                        <DropdownOption option={{
                            label: '35fps',
                            highlight: settings.frameRate === 35,
                            onClick: () => settings.frameRate = 35
                        }}/>
                        <DropdownOption option={{
                            label: '60fps',
                            highlight: settings.frameRate === 60,
                            onClick: () => settings.frameRate = 60
                        }}/>
                        <DropdownOption option={{
                            label: '75fps',
                            highlight: settings.frameRate === 75,
                            onClick: () => settings.frameRate = 75
                        }}/>
                    </DropdownOptions>
                </Dropdown>
            </AccordionTemplate>
        </>
    )
}
