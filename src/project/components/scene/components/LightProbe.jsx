import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import Range from "../../../../components/range/Range";
import AccordionTemplate from "../../../../components/templates/AccordionTemplate";
import useDirectState from "../../../utils/hooks/useDirectState";


export default function LightProbe(props) {
    const [state] = useDirectState({})
    const [selectedProbe, setSelectedProbe] = useState()
    const [probeTranslation, setProbeTranslation] = useState({})

    useEffect(() => {

        state.resolution = props.selected.resolution


    }, [props.selected])

    return (
        <AccordionTemplate type={'flex'} title={'Translation'}>
            <Range
                disabled={!selectedProbe}
                metric={'m'}
                accentColor={'red'}
                label={'x'}

                precision={3}
                incrementPercentage={.01}

                value={state.x}
                onFinish={(v) => props.submitProbe([v, state.y, state.z])}
                handleChange={e => setProbeTranslation({...state, x: parseInt(e)})}
            />
            <Range
                disabled={!selectedProbe}
                metric={'m'}
                accentColor={'#00ff00'}
                label={'y'}
                precision={3}
                incrementPercentage={.01}

                value={state.y}
                onFinish={(v) => props.submitProbe([state.x, v, state.z])}
                handleChange={e => setProbeTranslation({...state, y: parseInt(e)})}
            />
            <Range
                disabled={!selectedProbe}
                metric={'m'}
                accentColor={'#0095ff'}
                label={'z'}
                precision={3}
                incrementPercentage={.01}

                value={state.z}
                onFinish={(v) => props.submitProbe([state.x, state.y, v])}
                handleChange={e => setProbeTranslation({...state, z: parseInt(e)})}
            />
        </AccordionTemplate>
    )
}
LightProbe.propTypes = {
    selected: PropTypes.object,
    submit: PropTypes.func,
    submitProbe: PropTypes.func
}
