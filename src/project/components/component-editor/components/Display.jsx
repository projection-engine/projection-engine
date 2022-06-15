import React, {useContext, useEffect, useState} from "react"
import SettingsProvider from "../../../hooks/SettingsProvider"
import AccordionTemplate from "../../../../components/templates/AccordionTemplate"
import Range from "../../../../components/range/Range"

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
            <AccordionTemplate title={"Resolution X"}>
                <Range
                    accentColor={"red"}
                    onFinish={v => settings.resolution = [v, settings.resolution[1]]}
                    incrementPercentage={1}
                    precision={0}
                    handleChange={v => setState({...state, width: v})}
                    value={state.width}
                    minValue={1}/>
            </AccordionTemplate>
            <AccordionTemplate title={"Resolution Y"}>
                <Range
                    accentColor={"green"}
                    onFinish={v => settings.resolution = [settings.resolution[0], v]}
                    incrementPercentage={1}
                    precision={0}
                    handleChange={v => setState({...state, height: v})}
                    value={state.height}
                    minValue={1}/>
            </AccordionTemplate>
        </>
    )
}
