import PropTypes from "prop-types"
import React, {useEffect} from "react"
import Range from "../../../../views/range/Range"
import AccordionTemplate from "../../../../views/accordion/AccordionTemplate"
import useDirectState from "../../../../views/hooks/useDirectState"


export default function Line(props) {
    const [state] = useDirectState({origin: [0,0,0], destination: [0,0,0]})

    useEffect(() => {
        state.origin = props.selected.origin
        state.destination = props.selected.destination

    }, [props])

    return (
        <>
            <AccordionTemplate type={"flex"} title={"Origin"}>
                <Range
                    metric={"m"}
                    accentColor={"red"}
                    label={"x"}
                    value={state.origin[0]}
                    precision={3}
                    incrementPercentage={.01}

                    onFinish={(v) => {
                        props.submit("origin", [parseFloat(v), state.origin[1], state.origin[2]])
                    }}
                    handleChange={e => {
                        state.origin = [parseFloat(e), state.origin[1], state.origin[2]]
                    }}
                />
                <Range
                    metric={"m"}
                    accentColor={"#00ff00"}
                    label={"y"}
                    precision={3}
                    incrementPercentage={.01}
                    value={state.origin[1]}
                    onFinish={(v) => {
                        props.submit("origin", [state.origin[0], parseFloat(v), state.origin[2]])
                    }}
                    handleChange={e => {
                        state.origin = [state.origin[0], parseFloat(e), state.origin[2]]
                    }}
                />
                <Range
                    metric={"m"}
                    accentColor={"#0095ff"}
                    label={"z"}
                    precision={3}
                    incrementPercentage={.01}
                    value={state.origin[2]}
                    onFinish={(v) => {
                        props.submit("origin", [state.origin[0], state.origin[1], parseFloat(v)])
                    }}
                    handleChange={e => {
                        state.origin = [state.origin[0], state.origin[1], parseFloat(e)]
                    }}
                />
            </AccordionTemplate>
            <AccordionTemplate type={"flex"} title={"Destination"}>
                <Range
                    metric={"m"}
                    accentColor={"red"}
                    label={"x"}
                    value={state.destination[0]}
                    precision={3}
                    incrementPercentage={.01}

                    onFinish={(v) => {
                        props.submit("destination", [parseFloat(v), state.destination[1], state.destination[2]])
                    }}
                    handleChange={e => {
                        state.destination = [parseFloat(e), state.destination[1], state.destination[2]]
                    }}
                />
                <Range
                    metric={"m"}
                    accentColor={"#00ff00"}
                    label={"y"}
                    precision={3}
                    incrementPercentage={.01}
                    value={state.destination[1]}
                    onFinish={(v) => {
                        props.submit("destination", [state.destination[0], parseFloat(v), state.destination[2]])
                    }}
                    handleChange={e => {
                        state.destination = [state.destination[0], parseFloat(e), state.destination[2]]
                    }}
                />
                <Range
                    metric={"m"}
                    accentColor={"#0095ff"}
                    label={"z"}
                    precision={3}
                    incrementPercentage={.01}
                    value={state.destination[2]}
                    onFinish={(v) => {
                        props.submit("destination", [state.destination[0], state.destination[1], parseFloat(v)])
                    }}
                    handleChange={e => {
                        state.destination = [state.destination[0], state.destination[1], parseFloat(e)]
                    }}
                />
            </AccordionTemplate>
        </>
    )
}

Line.propTypes = {
    selected: PropTypes.object, submit: PropTypes.func,
}
