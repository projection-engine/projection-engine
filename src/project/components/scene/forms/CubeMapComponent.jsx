import PropTypes from "prop-types";
import styles from "../styles/Forms.module.css";
import {Checkbox, Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import React, {useEffect, useState} from "react";
import Range from "../../../../components/range/Range";
import AccordionTemplate from "../../../../components/templates/AccordionTemplate";


export default function CubeMapComponent(props) {
    const getNewState = () => {
        return {

            resolution: props.selected.resolution,
            irradiance: props.selected.irradiance,
            prefilteredMipmaps: props.selected.prefilteredMipmaps,
            radius: props.selected.radius
        }
    }
    const [state, setState] = useState(getNewState())
    useEffect(() => {
        setState(getNewState())
    }, [props.selected])

    if (!props.selected.asLightProbe)
        return (
            <>
                <AccordionTemplate title={'Resolution'}>
                    <Dropdown className={styles.dropdown}>
                        {state.resolution}p
                        <DropdownOptions>
                            <DropdownOption option={{
                                label: '128p',
                                icon: state.resolution === 128 ?
                                    <span style={{fontSize: '1.2rem'}}
                                          className={'material-icons-round'}>check</span> : undefined,
                                onClick: () => {
                                    setState({
                                        ...state,
                                        resolution: 128
                                    })
                                    props.submit(128, 'resolution')
                                }
                            }}/>
                            <DropdownOption option={{
                                label: '512p',
                                icon: state.resolution === 512 ?
                                    <span style={{fontSize: '1.2rem'}}
                                          className={'material-icons-round'}>check</span> : undefined,
                                onClick: () => {
                                    setState({
                                        ...state,
                                        resolution: 512
                                    })
                                    props.submit(512, 'resolution')
                                }
                            }}/>
                            <DropdownOption option={{
                                label: '1024p',
                                icon: state.resolution === 1024 ?
                                    <span style={{fontSize: '1.2rem'}}
                                          className={'material-icons-round'}>check</span> : undefined,
                                onClick: () => {
                                    setState({
                                        ...state,
                                        resolution: 1024
                                    })
                                    props.submit(1024, 'resolution')
                                }
                            }}/>
                            <DropdownOption option={{
                                label: '2048p',
                                icon: state.resolution === 2048 ?
                                    <span style={{fontSize: '1.2rem'}}
                                          className={'material-icons-round'}>check</span> : undefined,
                                onClick: () => {
                                    setState({
                                        ...state,
                                        resolution: 2048
                                    })
                                    props.submit(2048, 'resolution')
                                }
                            }}/>
                        </DropdownOptions>
                    </Dropdown>
                </AccordionTemplate>

                <AccordionTemplate title={'LOD samples'}>
                    <Range
                        accentColor={'blue'}
                        integer={true}
                        incrementPercentage={1}
                        minValue={1}
                        maxValue={10}

                        onFinish={(v) => props.submit(v, 'prefilteredMipmaps')}
                        value={state.prefilteredMipmaps}
                        handleChange={e => {
                            setState({...state, prefilteredMipmaps: parseInt(e)})
                        }}
                    />
                </AccordionTemplate>
                <Checkbox
                    checked={state.irradiance}
                    label={'Generate irradiance map'}
                    handleCheck={() => {
                        setState({...state, irradiance: !state.irradiance})
                        props.submit(!state.irradiance)
                    }} height={'25px'} width={'100%'}
                    noMargin={true}
                />
            </>
        )
    return null
}

CubeMapComponent.propTypes = {
    selected: PropTypes.object,
    submit: PropTypes.func
}
