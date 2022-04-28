import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import Range from "../../../components/range/Range";
import AccordionTemplate from "../../../components/accordion/AccordionTemplate";


const toDeg = 180 / Math.PI, toRad = Math.PI / 180
export default function CameraComponent(props) {
    const [state, setState] = useState({})
    const getNewState = () => {
        return {
            fov: Math.round(props.selected.fov * toDeg),
            aspectRatio: props.selected.aspectRatio,
            zNear: props.selected.zNear,
            zFar: props.selected.zFar
        }
    }
    useEffect(() => {
        setState(getNewState())
    }, [props])

    return (
        <>
            <AccordionTemplate title={'FOV'}>
                <Range
                    metric={'angle'}
                    accentColor={'red'}
                    value={state.fov} minValue={35}
                    maxValue={175}
                    precision={1}
                    incrementPercentage={.1}
                    onFinish={(v) => {
                        props.submit(v * toRad, 'fov')
                    }}
                    handleChange={e => setState({...state, fov: e})}
                />
            </AccordionTemplate>


            <AccordionTemplate title={'View planes'} type={'flex'}>
                <Range
                    accentColor={'red'}
                    value={state.zFar}
                    metric={'Far'}
                    precision={1}
                    incrementPercentage={.1}
                    onFinish={(v) => props.submit(v, 'zFar')}
                    handleChange={e => {
                        setState(prev => {
                            return {
                                ...prev,
                                zFar: e
                            }
                        })
                    }}
                />
                <Range
                    accentColor={'green'}
                    value={state.zNear}
                    metric={'Near'}
                    precision={1}
                    incrementPercentage={.1}
                    onFinish={(v) => props.submit(v, 'zNear')}
                    handleChange={e => {
                        setState(prev => {
                            return {
                                ...prev,
                                zNear: e
                            }
                        })
                    }}/>
            </AccordionTemplate>
        </>


    )
}

CameraComponent.propTypes = {
    selected: PropTypes.object,
    submit: PropTypes.func,
}
