import PropTypes from "prop-types";
import styles from "../styles/Forms.module.css";
import {Accordion, AccordionSummary, Checkbox, Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import React, {useEffect, useState} from "react";
import Range from "../../../components/range/Range";


export default function CubeMapComponent(props) {
    const getNewState = () => {
        return {
            placement: {
                x: props.selected.position[0],
                y: props.selected.position[1],
                z: props.selected.position[2]
            },
            resolution: props.selected.resolution,
            irradiance: props.selected.irradiance,
            prefilteredMipmaps: props.selected.prefilteredMipmaps,
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
                    Placement
                </AccordionSummary>
                <div className={styles.inputs}>
                    <Range
                        accentColor={'red'}
                        onFinish={() => props.submit([state.placement.x, state.placement.y, state.placement.z], 'position')}
                        precision={2}
                        metric={'x'}
                        value={state.placement.x}
                        handleChange={e => {
                            props.selected.position = [parseFloat(e), state.placement.y, state.placement.z]
                            setState({...state, placement: {...state.placement, x: parseFloat(e)}})
                        }}/>
                    <Range
                        accentColor={'green'}
                        onFinish={() => props.submit([state.placement.x, state.placement.y, state.placement.z], 'position')}
                        precision={2}
                        metric={'y'}
                        value={state.placement.y}
                        handleChange={e => {
                            props.selected.position = [state.placement.x, parseFloat(e), state.placement.z]
                            setState({...state, placement: {...state.placement, y: parseFloat(e)}})
                        }}/>
                    <Range
                        accentColor={'blue'}
                        onFinish={() => props.submit([state.placement.x, state.placement.y, state.placement.z], 'position')}
                        precision={2}
                        metric={'z'}
                        value={state.placement.z}
                        handleChange={e => {
                            props.selected.position = [state.placement.x, state.placement.y, parseFloat(e)]
                            setState({...state, placement: {...state.placement, z: parseFloat(e)}})
                        }}/>

                </div>
            </Accordion>

            <Accordion className={styles.fieldset}>
                <AccordionSummary className={styles.summary}>
                    Resolution
                </AccordionSummary>
                <div className={styles.formWrapper}>
                    <Dropdown className={styles.dropdown}>
                        {state.resolution}p
                        <DropdownOptions>
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
                            <DropdownOption option={{
                                label: '4096p',
                                icon: state.resolution === 4096 ?
                                    <span style={{fontSize: '1.2rem'}}
                                          className={'material-icons-round'}>check</span> : undefined,
                                onClick: () => {
                                    setState({
                                        ...state,
                                        resolution: 4096
                                    })
                                    props.submit(4096, 'resolution')
                                }
                            }}/>
                        </DropdownOptions>
                    </Dropdown>
                </div>
            </Accordion>


            <Accordion className={styles.fieldset}>
                <AccordionSummary className={styles.summary}>
                    Generation
                </AccordionSummary>



                    <div className={styles.inputsColumn} style={{marginBottom: '4px'}}>

                        <label className={styles.label} style={{marginBottom: '4px'}}>
                            Prefiltered LOD samples
                        </label>
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


                    <div className={styles.inputs}>
                        <Checkbox
                            checked={state.irradiance}
                            handleCheck={() => {
                                setState({...state, irradiance: !state.irradiance})
                                props.submit(!state.irradiance)
                            }}/>
                        <label className={styles.label}>
                            Generate irradiance map
                        </label>
                    </div>

            </Accordion>
        </>


    )
}

CubeMapComponent.propTypes = {
    selected: PropTypes.object,
    submit: PropTypes.func,

}
