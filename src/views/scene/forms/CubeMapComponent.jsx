import PropTypes from "prop-types";
import styles from "../styles/Forms.module.css";
import {Accordion, AccordionSummary, Checkbox, Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import React, {useEffect, useState} from "react";
import Range from "../../../components/range/Range";


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


    return (
        <>

            <Accordion className={styles.fieldset}>
                <AccordionSummary className={styles.summary}>
                    Resolution
                </AccordionSummary>
                <div className={styles.formWrapper}>
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
                </div>
            </Accordion>

            <Accordion className={styles.fieldset}>
                <AccordionSummary className={styles.summary}>
                    Affect Radius
                </AccordionSummary>
                <div className={styles.inputsColumn} style={{marginBottom: '4px'}}>

                    <Range
                        accentColor={'red'}
                        onFinish={() => props.submit(state.radius, 'radius')}
                        value={state.radius}
                        handleChange={e => {
                            setState({...state, radius: parseInt(e)})
                        }}
                    />
                </div>
            </Accordion>
            <Accordion className={styles.fieldset}>
                <AccordionSummary className={styles.summary}>
                    Prefiltered LOD samples
                </AccordionSummary>
                    <div className={styles.inputsColumn} style={{marginBottom: '4px'}}>
                        <Range
                            accentColor={'blue'}
                            integer={true}
                            incrementPercentage={1}
                            minValue={1}
                            maxValue={10}

                            onFinish={() => props.submit(state.prefilteredMipmaps, 'prefilteredMipmaps')}
                            value={state.prefilteredMipmaps}
                            handleChange={e => {
                                setState({...state, prefilteredMipmaps: parseInt(e)})
                            }}
                        />
                    </div>
            </Accordion>
                <Checkbox
                    checked={state.irradiance}
                    label={'Generate irradiance map'}
                    handleCheck={() => {
                        setState({...state, irradiance: !state.irradiance})
                        props.submit(!state.irradiance)
                    }} height={'35px'} width={'100%'}
                    noMargin={true}/>
        </>


    )
}

CubeMapComponent.propTypes = {
    selected: PropTypes.object,
    submit: PropTypes.func
}
